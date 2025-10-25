import got from 'got';
import { CookieJar } from 'tough-cookie';
import { parse } from 'node-html-parser';

// Types
interface CalendarEvent {
  eventId: string;
  title: string;
  description: string;
  eventType: 'Exam' | 'Holiday' | 'Assignment' | 'Lecture' | 'Lab' | 'Other';
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  isAllDay: boolean;
  priority: 'High' | 'Medium' | 'Low';
  semester: string;
  academicYear: string;
}

interface EventFilters {
  startDate?: string;
  endDate?: string;
  eventType?: string;
  semester?: string;
  priority?: string;
}

interface CalendarResponse {
  success: boolean;
  data: CalendarEvent[];
  totalEvents: number;
  academicYear: string;
  error?: string;
}

interface EventStatistics {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  examEvents: number;
  assignmentEvents: number;
  holidayEvents: number;
}

// Global cookie jar reference
let globalCookieJar: CookieJar | null = null;

export function setCookieJar(cookieJar: CookieJar): void {
  globalCookieJar = cookieJar;
}

export async function fetchCalendarEvents(filters?: EventFilters): Promise<CalendarResponse> {
  try {
    if (!globalCookieJar) {
      throw new Error('Cookie jar not initialized. Please authenticate first.');
    }

    // Generate dynamic URL for calendar
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let academicYearString;
    let semesterType;

    if (currentMonth >= 1 && currentMonth <= 6) {
      semesterType = "EVEN";
      academicYearString = `${currentYear - 1}_${currentYear.toString().slice(-2)}`;
    } else {
      semesterType = "ODD";
      academicYearString = `${currentYear}_${(currentYear + 1).toString().slice(-2)}`;
    }

    const calendarUrl = `https://academia.srmist.edu.in/srm_university/academia-academic-services/page/Academic_Planner_${academicYearString}_${semesterType}`;
    
    const response = await got.get(calendarUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://academia.srmist.edu.in/',
        'x-requested-with': 'XMLHttpRequest',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      cookieJar: globalCookieJar,
      timeout: {
        request: 15000
      }
    });

    const responseHtml = parse(response.body);
    
    // Check if we're still logged in
    if (responseHtml.querySelector('.login-form') !== null) {
      return {
        success: false,
        data: [],
        totalEvents: 0,
        academicYear: 'Current',
        error: 'Session expired. Please login again.'
      };
    }

    const parsedEvents = parseCalendarData(responseHtml);
    
    return {
      success: true,
      data: parsedEvents,
      totalEvents: parsedEvents.length,
      academicYear: 'Current'
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      totalEvents: 0,
      academicYear: 'Current',
      error: error.message
    };
  }
}

function parseCalendarData(html: any): CalendarEvent[] {
  const calendarEvents: CalendarEvent[] = [];
  
  // Look for calendar events container or event list
  const eventsContainer = html.querySelector('.calendar-events') || 
                         html.querySelector('.events-list') ||
                         html.querySelector('.event-container') ||
                         html.querySelector('[class*="event"]');
  
  if (!eventsContainer) {
    return calendarEvents;
  }

  // Look for individual event elements
  const eventElements = eventsContainer.querySelectorAll('.event-item') ||
                       eventsContainer.querySelectorAll('.calendar-event') ||
                       eventsContainer.querySelectorAll('[class*="event"]') ||
                       eventsContainer.querySelectorAll('.card');
  
  for (const eventElement of eventElements) {
    try {
      const titleElement = eventElement.querySelector('.event-title') ||
                          eventElement.querySelector('.title') ||
                          eventElement.querySelector('h3') ||
                          eventElement.querySelector('h4');
      
      const dateElement = eventElement.querySelector('.event-date') ||
                         eventElement.querySelector('.date') ||
                         eventElement.querySelector('[class*="date"]');
      
      const descriptionElement = eventElement.querySelector('.event-description') ||
                                eventElement.querySelector('.description') ||
                                eventElement.querySelector('p');
      
      const typeElement = eventElement.querySelector('.event-type') ||
                         eventElement.querySelector('.type') ||
                         eventElement.querySelector('[class*="type"]');

      const title = titleElement?.textContent?.trim() || '';
      const dateText = dateElement?.textContent?.trim() || '';
      const description = descriptionElement?.textContent?.trim() || '';
      const typeText = typeElement?.textContent?.trim() || '';

      // Parse date
      const dateMatch = dateText.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
      const eventDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

      // Extract time if available
      const timeMatch = dateText.match(/(\d{1,2}:\d{2})\s*(?:AM|PM)?/i);
      const startTime = timeMatch ? timeMatch[1] : undefined;

      const event: CalendarEvent = {
        eventId: generateEventId(),
        title,
        description,
        eventType: determineEventType(typeText, title),
        startDate: eventDate,
        endDate: eventDate,
        startTime,
        endTime: undefined,
        location: undefined,
        isAllDay: !startTime,
        priority: determinePriority(typeText, title),
        semester: '',
        academicYear: 'Current'
      };

      calendarEvents.push(event);
    } catch (parseError) {
      console.warn('Failed to parse calendar event:', parseError);
    }
  }
  
  return calendarEvents;
}

function determineEventType(eventType: string, title: string): 'Exam' | 'Holiday' | 'Assignment' | 'Lecture' | 'Lab' | 'Other' {
  const type = eventType?.toLowerCase() || '';
  const titleLower = title?.toLowerCase() || '';
  
  if (type.includes('exam') || titleLower.includes('exam')) return 'Exam';
  if (type.includes('holiday') || titleLower.includes('holiday')) return 'Holiday';
  if (type.includes('assignment') || titleLower.includes('assignment')) return 'Assignment';
  if (type.includes('lecture') || titleLower.includes('lecture')) return 'Lecture';
  if (type.includes('lab') || titleLower.includes('lab')) return 'Lab';
  
  return 'Other';
}

function determinePriority(priority: string, eventType: string): 'High' | 'Medium' | 'Low' {
  const priorityLower = priority?.toLowerCase() || '';
  const typeLower = eventType?.toLowerCase() || '';
  
  if (priorityLower === 'high' || typeLower.includes('exam')) return 'High';
  if (priorityLower === 'medium' || typeLower.includes('assignment')) return 'Medium';
  
  return 'Low';
}

function generateEventId(): string {
  return 'event_' + Math.random().toString(36).substr(2, 9);
}

export async function getUpcomingEvents(days: number = 30): Promise<CalendarEvent[]> {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  
  const filters: EventFilters = {
    startDate: new Date().toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
  
  const calendarResponse = await fetchCalendarEvents(filters);
  
  if (!calendarResponse.success) {
    return [];
  }
  
  return calendarResponse.data.sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

export async function getEventsByType(eventType: string): Promise<CalendarEvent[]> {
  const calendarResponse = await fetchCalendarEvents({ eventType });
  
  if (!calendarResponse.success) {
    return [];
  }
  
  return calendarResponse.data;
}

export async function getExamSchedule(): Promise<CalendarEvent[]> {
  return getEventsByType('Exam');
}

export async function getAssignmentDeadlines(): Promise<CalendarEvent[]> {
  return getEventsByType('Assignment');
}

export async function getHolidayList(): Promise<CalendarEvent[]> {
  return getEventsByType('Holiday');
}

export async function getCalendarStatistics(): Promise<EventStatistics> {
  const calendarResponse = await fetchCalendarEvents();
  
  if (!calendarResponse.success) {
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      pastEvents: 0,
      examEvents: 0,
      assignmentEvents: 0,
      holidayEvents: 0
    };
  }
  
  const now = new Date();
  const upcomingEvents = calendarResponse.data.filter(event => 
    new Date(event.startDate) >= now
  ).length;
  
  const pastEvents = calendarResponse.data.length - upcomingEvents;
  const examEvents = calendarResponse.data.filter(e => e.eventType === 'Exam').length;
  const assignmentEvents = calendarResponse.data.filter(e => e.eventType === 'Assignment').length;
  const holidayEvents = calendarResponse.data.filter(e => e.eventType === 'Holiday').length;

  return {
    totalEvents: calendarResponse.data.length,
    upcomingEvents,
    pastEvents,
    examEvents,
    assignmentEvents,
    holidayEvents
  };
}
