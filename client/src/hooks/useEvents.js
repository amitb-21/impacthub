// useEvents hook template
import { useState } from 'react';

export function useEvents() {
  const [events, setEvents] = useState([]);
  return { events, setEvents };
}
