// src/modules/district/data/clubsData.js
import { CLUB_ANALYTICS } from './analyticsData'

export const CLUBS_5656 = CLUB_ANALYTICS.map(c => ({
  id:          c.id,
  name:        c.name,
  meetingDay:  c.meetingDay,
  meetingTime: c.meetingTime,
  members:     c.members,
}))
