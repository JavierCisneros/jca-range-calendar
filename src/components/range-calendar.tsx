"use client";

import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";

function RangeCalendar({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<[Date, Date] | null>(null);

  return (
    <RangeCalendar>
      <Label>Range</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-md border"></Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar mode="range" className="rounded-md border" />
        </PopoverContent>
      </Popover>
    </RangeCalendar>
  );
}

export default RangeCalendar;
