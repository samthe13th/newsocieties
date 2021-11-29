export interface FeedItem {
  type: 'chat' | 'resolution' | 'event' | 'broadcast';
  value: string;
  from: 'central' | 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';
}