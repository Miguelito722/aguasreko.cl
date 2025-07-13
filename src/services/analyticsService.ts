// Analytics Service for tracking visitors and their geographic location
export interface VisitorData {
  id: string;
  timestamp: string;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  userAgent: string;
  referrer: string;
  page: string;
  sessionId: string;
  isReturning: boolean;
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  countries: { [key: string]: number };
  regions: { [key: string]: number };
  cities: { [key: string]: number };
  referrers: { [key: string]: number };
  pages: { [key: string]: number };
  hourlyStats: { [hour: string]: number };
  dailyStats: { [date: string]: number };
}

export class AnalyticsService {
  private static readonly STORAGE_KEY = 'aguasreko_analytics';
  private static readonly SESSION_KEY = 'aguasreko_session';
  private static readonly VISITOR_KEY = 'aguasreko_visitor_id';

  // Get visitor's geographic location using IP geolocation
  static async getVisitorLocation(): Promise<{
    country?: string;
    region?: string;
    city?: string;
    ip?: string;
  }> {
    try {
      // Try multiple geolocation services for better reliability
      const services = [
        'https://ipapi.co/json/',
        'https://api.ipify.org?format=json', // Fallback for IP only
        'https://httpbin.org/ip' // Another fallback
      ];

      for (const service of services) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          
          if (service.includes('ipapi.co')) {
            return {
              country: data.country_name || 'Unknown',
              region: data.region || 'Unknown',
              city: data.city || 'Unknown',
              ip: data.ip || 'Unknown'
            };
          } else {
            // For IP-only services, we'll use a simpler approach
            return {
              country: 'Chile', // Default assumption for local business
              region: 'Biobío',
              city: 'Los Ángeles',
              ip: data.ip || data.origin || 'Unknown'
            };
          }
        } catch (error) {
          console.warn(`Geolocation service ${service} failed:`, error);
          continue;
        }
      }
      
      // Fallback to browser geolocation API
      return await this.getBrowserLocation();
    } catch (error) {
      console.error('All geolocation services failed:', error);
      return {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        ip: 'Unknown'
      };
    }
  }

  // Browser-based geolocation (requires user permission)
  private static async getBrowserLocation(): Promise<{
    country?: string;
    region?: string;
    city?: string;
    ip?: string;
  }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          country: 'Chile',
          region: 'Biobío',
          city: 'Los Ángeles',
          ip: 'Unknown'
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding using OpenStreetMap Nominatim
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`
            );
            const data = await response.json();
            
            resolve({
              country: data.address?.country || 'Chile',
              region: data.address?.state || 'Biobío',
              city: data.address?.city || data.address?.town || 'Los Ángeles',
              ip: 'Geolocation'
            });
          } catch (error) {
            resolve({
              country: 'Chile',
              region: 'Biobío',
              city: 'Los Ángeles',
              ip: 'Geolocation'
            });
          }
        },
        () => {
          resolve({
            country: 'Chile',
            region: 'Biobío',
            city: 'Los Ángeles',
            ip: 'Unknown'
          });
        },
        { timeout: 5000 }
      );
    });
  }

  // Generate or get existing session ID
  static getSessionId(): string {
    let sessionId = sessionStorage.getItem(this.SESSION_KEY);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(this.SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  // Generate or get existing visitor ID
  static getVisitorId(): string {
    let visitorId = localStorage.getItem(this.VISITOR_KEY);
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(this.VISITOR_KEY, visitorId);
    }
    return visitorId;
  }

  // Check if visitor is returning
  static isReturningVisitor(): boolean {
    return localStorage.getItem(this.VISITOR_KEY) !== null;
  }

  // Track a page visit
  static async trackVisit(page: string = window.location.pathname): Promise<void> {
    try {
      const location = await this.getVisitorLocation();
      const visitorId = this.getVisitorId();
      const sessionId = this.getSessionId();
      const isReturning = this.isReturningVisitor();

      const visitData: VisitorData = {
        id: `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...location,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct',
        page,
        sessionId,
        isReturning
      };

      // Store visit data
      const existingData = this.getStoredAnalytics();
      existingData.push(visitData);
      
      // Keep only last 1000 visits to prevent storage overflow
      if (existingData.length > 1000) {
        existingData.splice(0, existingData.length - 1000);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));

      // Update visit counter
      this.updateVisitCounter();
      
      console.log('Visit tracked:', visitData);
    } catch (error) {
      console.error('Failed to track visit:', error);
    }
  }

  // Get stored analytics data
  private static getStoredAnalytics(): VisitorData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse analytics data:', error);
      return [];
    }
  }

  // Update visit counter for header display
  private static updateVisitCounter(): void {
    const visits = this.getStoredAnalytics();
    const totalVisits = visits.length;
    localStorage.setItem('aguasreko_visit_count', totalVisits.toString());
    localStorage.setItem('aguasreko_last_visit', new Date().toDateString());
  }

  // Get analytics summary
  static getAnalyticsSummary(): AnalyticsData {
    const visits = this.getStoredAnalytics();
    const today = new Date().toDateString();
    const uniqueVisitors = new Set(visits.map(v => v.sessionId)).size;
    const todayVisits = visits.filter(v => 
      new Date(v.timestamp).toDateString() === today
    ).length;

    // Aggregate data
    const countries: { [key: string]: number } = {};
    const regions: { [key: string]: number } = {};
    const cities: { [key: string]: number } = {};
    const referrers: { [key: string]: number } = {};
    const pages: { [key: string]: number } = {};
    const hourlyStats: { [hour: string]: number } = {};
    const dailyStats: { [date: string]: number } = {};

    visits.forEach(visit => {
      // Geographic data
      if (visit.country) countries[visit.country] = (countries[visit.country] || 0) + 1;
      if (visit.region) regions[visit.region] = (regions[visit.region] || 0) + 1;
      if (visit.city) cities[visit.city] = (cities[visit.city] || 0) + 1;
      
      // Referrer data
      const referrer = this.cleanReferrer(visit.referrer);
      referrers[referrer] = (referrers[referrer] || 0) + 1;
      
      // Page data
      pages[visit.page] = (pages[visit.page] || 0) + 1;
      
      // Time-based data
      const date = new Date(visit.timestamp);
      const hour = date.getHours().toString().padStart(2, '0');
      const day = date.toDateString();
      
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
      dailyStats[day] = (dailyStats[day] || 0) + 1;
    });

    return {
      totalVisits: visits.length,
      uniqueVisitors,
      todayVisits,
      countries,
      regions,
      cities,
      referrers,
      pages,
      hourlyStats,
      dailyStats
    };
  }

  // Clean referrer URL for better readability
  private static cleanReferrer(referrer: string): string {
    if (!referrer || referrer === '') return 'Direct';
    
    try {
      const url = new URL(referrer);
      const domain = url.hostname.replace('www.', '');
      
      // Map common domains to readable names
      const domainMap: { [key: string]: string } = {
        'google.com': 'Google',
        'google.cl': 'Google Chile',
        'facebook.com': 'Facebook',
        'instagram.com': 'Instagram',
        'twitter.com': 'Twitter',
        'linkedin.com': 'LinkedIn',
        'youtube.com': 'YouTube',
        'whatsapp.com': 'WhatsApp',
        't.co': 'Twitter',
        'fb.me': 'Facebook'
      };
      
      return domainMap[domain] || domain;
    } catch (error) {
      return referrer.length > 30 ? referrer.substring(0, 30) + '...' : referrer;
    }
  }

  // Export analytics data
  static exportAnalytics(): string {
    const data = this.getAnalyticsSummary();
    const visits = this.getStoredAnalytics();
    
    return JSON.stringify({
      summary: data,
      visits: visits,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  // Clear analytics data
  static clearAnalytics(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.VISITOR_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.setItem('aguasreko_visit_count', '0');
  }

  // Get real-time visitor count (simulated)
  static getActiveVisitors(): number {
    const visits = this.getStoredAnalytics();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return visits.filter(visit => 
      new Date(visit.timestamp) > fiveMinutesAgo
    ).length;
  }
}