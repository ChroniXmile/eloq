"use client";

import React, { useRef } from "react";
import { AnimatedBeam } from "./animated-beam";
import { Trophy, Users } from "lucide-react";

const PlayerTournamentBeam = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full h-full items-center justify-center overflow-hidden"
      ref={containerRef}
    >
      <div className="flex w-11/12 h-full flex-row items-center justify-between">
        {/* Single Player Icon (Left) */}
        <div
          ref={div1Ref}
          className="z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-background p-2"
        >
          <Users className="h-8 w-8 text-primary" />
        </div>

        {/* Center Tournament Icon */}
        <div
          ref={div2Ref}
          className="z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-background p-3"
        >
          <Trophy className="h-10 w-10 text-primary" />
        </div>

        {/* Player Icons branching from center */}
        <div className="flex flex-col items-center gap-3">
          <div
            ref={div3Ref}
            className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-background p-2"
          >
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div
            ref={div4Ref}
            className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-background p-2"
          >
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div
            ref={div5Ref}
            className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-background p-2"
          >
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div
            ref={div6Ref}
            className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-background p-2"
          >
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div
            ref={div7Ref}
            className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-background p-2"
          >
            <Users className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        duration={3}
        delay={0}
        curvature={-40}
        endYOffset={5}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div1Ref}
        duration={3}
        delay={0.5}
        curvature={40}
        reverse={true}
        startYOffset={5}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div3Ref}
        duration={3}
        delay={1}
        curvature={30}
        startYOffset={15}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        duration={3}
        delay={1.2}
        curvature={20}
        startYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div5Ref}
        duration={3}
        delay={1.4}
        curvature={0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
        delay={1.6}
        curvature={-20}
        startYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div7Ref}
        duration={3}
        delay={1.8}
        curvature={-30}
        startYOffset={-15}
      />
    </div>
  );
};

export { PlayerTournamentBeam };