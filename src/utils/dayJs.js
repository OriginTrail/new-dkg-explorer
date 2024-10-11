import dayJs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
dayJs.extend(relativeTime);
dayJs.extend(duration);

export default dayJs;
