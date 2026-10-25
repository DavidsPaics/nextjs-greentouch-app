"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { setGreentouchSessionUnlockDelay } from "@/actions/greentouch-session";
import { toast } from "sonner";
import { TimerIcon } from "lucide-react";

interface UnlockDelayDialogProps {
    unlockDelayDialogTranslations: {
        sessionTitle: string;
        title: string;
        description1: string;
        description2: string;
        labelHours: string;
        actionButton: string;
        successMessage: string;
        errorMessage: string;
    },
    sessionName: string;
    initialUnlockDelayHours: number;
}

export function UnlockDelayDialog({ unlockDelayDialogTranslations, sessionName, initialUnlockDelayHours }: UnlockDelayDialogProps) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState<string>(String(initialUnlockDelayHours));
  const [isPending, startTransition] = useTransition();

  const parsedHours = Number(hours);
  const isValid = hours !== "" && Number.isInteger(parsedHours) && parsedHours >= 0;

  const handleSave = () => {
    if (!isValid) return;

    startTransition(async () => {
      const result = await setGreentouchSessionUnlockDelay(sessionName, parsedHours);
      if (result.success) {
        toast.success(unlockDelayDialogTranslations.successMessage);
        setOpen(false);
      } else {
        console.error("Error setting unlock delay:", result.error);
        toast.error(unlockDelayDialogTranslations.errorMessage);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button variant="outline" size="sm">
            <TimerIcon className="h-4 w-4" />
            {initialUnlockDelayHours}h
        </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
            <DialogTitle>{unlockDelayDialogTranslations.title}</DialogTitle>
            <DialogDescription>
                {unlockDelayDialogTranslations.description1} <b>{unlockDelayDialogTranslations.sessionTitle}</b> {unlockDelayDialogTranslations.description2}
            </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{unlockDelayDialogTranslations.labelHours}</label>
                <Input
                type="number"
                min={0}
                step={1}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                />
            </div>

            <DialogFooter>
            <Button onClick={handleSave} disabled={isPending || !isValid}>
                {unlockDelayDialogTranslations.actionButton}
            </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
