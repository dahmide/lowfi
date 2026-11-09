import { useIsTouchDevice } from "@/hooks/use-is-touch-device";
import { Logo } from "@/components/custom/logo";
import { useFirstGesture } from "@/hooks/use-first-gesture";

export default function Prompt({
    listenerCount,
    onTuneChange,
}: {
    listenerCount: number;
    onTuneChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const isTouch = useIsTouchDevice();
    const command = isTouch ? "Tap to start" : "Press any key to start";

    useFirstGesture(() => onTuneChange(true));
    return (
        <div className="flex-1 flex flex-col gap-1 items-center justify-center">
            <Logo />
            {command}
        </div>
    );
}
