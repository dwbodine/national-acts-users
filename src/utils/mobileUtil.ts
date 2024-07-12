import { WindowSize } from "@/types/windowSize";
import { MOBILE_WIDTH_BREAKPOINT } from "@/constants";

export default function isMobileWidth(windowSize: WindowSize): boolean {
    return windowSize.width < MOBILE_WIDTH_BREAKPOINT;
}