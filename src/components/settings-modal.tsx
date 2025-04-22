"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/store/settingsStore";
import { Settings } from "lucide-react";

export function SettingsModal() {
  const { closeSettings, darkMode, toggleDarkMode } = useSettingsStore();

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-2 w-full">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your preferences below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
          {/* ‣ Add additional toggles or inputs here */}
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline" onClick={closeSettings}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
