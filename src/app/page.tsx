import RangeCalendar from "@/components/range-calendar";
import { Label } from "@/components/ui/label";

function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <RangeCalendar>
        <Label>Range</Label>
      </RangeCalendar>
    </div>
  );
}
export default Home;
