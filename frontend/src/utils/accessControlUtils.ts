import { apiService } from '../services/api/baseApiService';
import { StorageUtils } from './storageUtils';
import { eventBus } from './eventBusUtils';

export enum AccessLevel {
  NONE = 0,
  READ = 1,
  WRITE = 2,
  ADMIN = 3
}

export interface Permission {
  resource: string;
  accessLevel: AccessLevel;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export class AccessControlUtils {
  // Current user's roles and permissions
  private static userRoles: UserRole[] = [];
  
  // Cache for permission checks
  private static permissionCache = new Map<string, boolean>();

  // Initialize access control
  static async initializeUserRoles(): Promise<void> {
    try {
      // Fetch user roles from API
      const fetchedRoles = await apiService.get('/user/roles');
      
      this.userRoles = fetchedRoles;
      
      // Cache roles in secure storage
      StorageUtils.setItem('user_roles', fetchedRoles, {
        encrypted: true
      });

      // Publish role initialization event
      eventBus.publish('access:roles_initialized', fetchedRoles);
    } catch (error) {
      console.error('Failed to fetch user roles', error);
      
      // Fallback to cached roles
      const cachedRoles = StorageUtils.getItem('user_roles');
      if (cachedRoles) {
        this.userRoles = cachedRoles;
      }
    }
  }

  // Check if user has specific permission
  static hasPermission(
    resource: string, 
    requiredAccessLevel: AccessLevel = AccessLevel.READ
  ): boolean {
    // Check cache first
    const cacheKey = `${resource}_${requiredAccessLevel}`;
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey);
    }

    // Evaluate permissions across all roles
    const hasPermission = this.userRoles.some(role => 
      role.permissions.some(permission => 
        permission.resource === resource && 
        permission.accessLevel >= requiredAccessLevel
      )
    );

    // Cache result
    this.permissionCache.set(cacheKey, hasPermission);

    return hasPermission;
  }

  // Get maximum access level for a resource
  static getMaxAccessLevel(resource: string): AccessLevel {
    return Math.max(
      ...this.userRoles.flatMap(role => 
        role.permissions
          .filter(p => p.resource === resource)
          .map(p => p.accessLevel)
      ),
      AccessLevel.NONE
    );
  }

  // Conditional rendering helper
  static renderWithPermission<T>(
    resource: string, 
    requiredAccessLevel: AccessLevel,
    renderFn: () => T,
    fallbackFn?: () => T
  ): T | null {
    if (this.hasPermission(resource, requiredAccessLevel)) {
      return renderFn();
    }
    
    return fallbackFn ? fallbackFn() : null;
  }

  // Action authorization
  static authorizeAction(
    resource: string, 
    action: string
  ): boolean {
    const actionAccessLevels = {
      'view': AccessLevel.READ,
      'create': AccessLevel.WRITE,
      'update': AccessLevel.WRITE,
      'delete': AccessLevel.ADMIN
    };

    const requiredAccessLevel = actionAccessLevels[action] || AccessLevel.NONE;
    
    return this.hasPermission(resource, requiredAccessLevel);
  }

  // Get user's roles
  static getUserRoles(): UserRole[] {
    return [...this.userRoles];
  }

  // Dynamic permission update
  static updatePermissions(
    newPermissions: Permission[]
  ): void {
    // Clear permission cache
    this.permissionCache.clear();

    // Update roles
    this.userRoles.forEach(role => {
      newPermissions.forEach(newPerm => {
        const existingPermIndex = role.permissions.findIndex(
          p => p.resource === newPerm.resource
        );

        if (existingPermIndex !== -1) {
          role.permissions[existingPermIndex] = newPerm;
        } else {
          role.permissions.push(newPerm);
        }
      });
    });

    // Publish permission update event
    eventBus.publish('access:permissions_updated', this.userRoles);
  }

  // Listen to permission changes
  static onPermissionChange(
    callback: (roles: UserRole[]) => void
  ): () => void {
    return eventBus.subscribe('access:permissions_updated', callback);
  }

  // Secure action wrapper
  static async secureAction<T>(
    resource: string, 
    action: string, 
    actionFn: () => Promise<T>
  ): Promise<T | null> {
    if (this.authorizeAction(resource, action)) {
      try {
        return await actionFn();
      } catch (error) {
        // Log unauthorized access attempt
        this.logUnauthorizedAccessAttempt(resource, action);
        throw error;
      }
    } else {
      // Log and throw unauthorized access
      this.logUnauthorizedAccessAttempt(resource, action);
      throw new Error('Unauthorized access');
    }
  }

  // Log unauthorized access attempts
  private static logUnauthorizedAccessAttempt(
    resource: string, 
    action: string
  ): void {
    apiService.post('/security/access-log', {
      resource,
      action,
      timestamp: new Date().toISOString()
    });
  }
}

// Initialize on app startup
AccessControlUtils.initializeUserRoles();

// Example usage
export const accessControl = AccessControlUtils;

// In a component
function LeadManagementComponent() {
  // Conditionally render based on permissions
  return accessControl.renderWithPermission(
    'leads', 
    AccessLevel.WRITE,
    () => <LeadCreateForm />,
    () => <PermissionDeniedMessage />
  );
}

// Secure action example
async function deleteLead(leadId: string) {
  await accessControl.secureAction(
    'leads', 
    'delete', 
    async () => {
      // Actual delete logic
      return apiService.delete(`/leads/${leadId}`);
    }
  );
}