import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Settings from './components/pages/Settings';
import Profile from './components/pages/Profile';
import FAQ from './components/pages/FAQ';
import AdminPanel from './components/pages/AdminPanel';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import PerformanceMetrics from './components/Dashboard/PerformanceMetrics';
import RealTimeAnalytics from './components/Dashboard/RealTimeAnalytics';
import CampaignCreationWizard from './components/Campaign/CampaignCreationWizard';
import CampaignDashboard from './components/Campaign/CampaignDashboard';
import CampaignReport from './components/Campaign/CampaignReport';
import CampaignAnalytics from './components/Campaign/CampaignAnalytics';
import CampaignAutomation from './components/Campaign/CampaignAutomation';
import LeadList from './components/Lead/LeadList';
import LeadDetail from './components/Lead/LeadDetail';
import LeadEnrichment from './components/Lead/LeadEnrichment';
import LeadScoring from './components/Lead/LeadScoring';
import LeadPrediction from './components/Lead/LeadPrediction';
import NotificationCenter from './components/Notifications/NotificationCenter';
import PushNotifications from './components/Notifications/PushNotifications';
import AgentDashboard from './components/Agents/AgentDashboard';
import AgentSettings from './components/Agents/AgentSettings';
import AgentPerformance from './components/Agents/AgentPerformance';
import AgentChat from './components/Agents/AgentChat';
import SocialMediaConnection from './components/SocialMedia/SocialMediaConnection';
import SocialMediaSettings from './components/SocialMedia/SocialMediaSettings';
import SocialMediaAnalytics from './components/SocialMedia/SocialMediaAnalytics';
import AIBot from './components/AI/AIBot';
import AIPredictions from './components/AI/AIPredictions';
import AIGeneratedContent from './components/AI/AIGeneratedContent';
import SelfLearning from './components/AI/SelfLearning';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PasswordReset from './components/Auth/PasswordReset';
import MultiFactorAuth from './components/Auth/MultiFactorAuth';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/settings" component={Settings} />
        <Route path="/profile" component={Profile} />
        <Route path="/faq" component={FAQ} />
        <Route path="/admin" component={AdminPanel} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/user-dashboard" component={UserDashboard} />
        <Route path="/performance-metrics" component={PerformanceMetrics} />
        <Route path="/real-time-analytics" component={RealTimeAnalytics} />
        <Route path="/campaign/create" component={CampaignCreationWizard} />
        <Route path="/campaign/dashboard" component={CampaignDashboard} />
        <Route path="/campaign/report/:id" component={CampaignReport} />
        <Route path="/campaign/analytics/:id" component={CampaignAnalytics} />
        <Route path="/campaign/automation/:id" component={CampaignAutomation} />
        <Route path="/leads" component={LeadList} />
        <Route path="/lead/:id" component={LeadDetail} />
        <Route path="/lead/enrich/:id" component={LeadEnrichment} />
        <Route path="/lead/score/:id" component={LeadScoring} />
        <Route path="/lead/predict/:id" component={LeadPrediction} />
        <Route path="/notifications" component={NotificationCenter} />
        <Route path="/push-notifications" component={PushNotifications} />
        <Route path="/agent/dashboard" component={AgentDashboard} />
        <Route path="/agent/settings" component={AgentSettings} />
        <Route path="/agent/performance/:id" component={AgentPerformance} />
        <Route path="/agent/chat/:id" component={AgentChat} />
        <Route path="/social-media/connect" component={SocialMediaConnection} />
        <Route path="/social-media/settings" component={SocialMediaSettings} />
        <Route path="/social-media/analytics" component={SocialMediaAnalytics} />
        <Route path="/ai/bot" component={AIBot} />
        <Route path="/ai/predictions" component={AIPredictions} />
        <Route path="/ai/generated-content" component={AIGeneratedContent} />
        <Route path="/ai/self-learning" component={SelfLearning} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/password-reset" component={PasswordReset} />
        <Route path="/mfa" component={MultiFactorAuth} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
