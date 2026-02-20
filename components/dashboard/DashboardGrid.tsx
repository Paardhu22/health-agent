"use client";

import Link from "next/link";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import {
    Activity,
    Flame,
    Heart,
    MessageCircle,
} from "lucide-react";

interface DashboardGridProps {
    healthScore: number;
    caloriesBurned: number;
    userName: string;
}

export function DashboardGrid({
    healthScore,
    caloriesBurned,
    userName,
}: DashboardGridProps) {
    return (
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[38rem] xl:grid-rows-2">

            {/* AI Chat — Large card (Full Width) */}
            <GridItem
                area="md:[grid-area:1/1/2/13] xl:[grid-area:1/1/2/13] min-h-[12rem]"
                icon={<MessageCircle className="h-5 w-5" />}
                title="AI Health Chat"
                description="Ask anything about your health, nutrition, sleep, or fitness. Your personal AI wellness companion."
                href="/chat"
            />

            {/* Daily Score & Metrics - Left */}
            <GridItem
                area="md:[grid-area:2/1/3/7] xl:[grid-area:2/1/3/7]"
                icon={<Activity className="h-5 w-5" />}
                title="Daily Overview"
                description={
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-white">{Math.round(healthScore)}</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">Daily Score</span>
                                <span className="text-xs text-muted-foreground">
                                    {healthScore > 80
                                        ? "Excellent"
                                        : healthScore > 50
                                            ? "Keep going"
                                            : "Needs attention"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                            <div className="p-1.5 rounded-full bg-orange-500/10 text-orange-500">
                                <Flame className="h-4 w-4" />
                            </div>
                            <span className="text-sm text-zinc-300 font-medium">{caloriesBurned} <span className="text-zinc-500 font-normal">kcal burned</span></span>
                        </div>
                    </div>
                }
            />

            {/* Yoga — Right */}
            <GridItem
                area="md:[grid-area:2/7/3/13] xl:[grid-area:2/7/3/13]"
                icon={<Heart className="h-5 w-5" />}
                title="Begin Yoga Session"
                description={
                    <div className="space-y-4">
                        <p className="line-clamp-2 text-sm text-muted-foreground">Personalized flows tailored for your fitness level. Improve flexibility and mental clarity.</p>
                        <div className="flex flex-wrap gap-2">
                            {["Heart Health", "Better Sleep", "Focus"].map((tag) => (
                                <span key={tag} className="px-2.5 py-1 rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-300 border border-zinc-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                }
                href="/yoga"
            />
        </ul>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
    href?: string;
}

const GridItem = ({ area, icon, title, description, href }: GridItemProps) => {
    const content = (
        <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
            />
            <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
                <div className="relative flex flex-1 flex-col justify-between gap-3">
                    <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
                        {icon}
                    </div>
                    <div className="space-y-3">
                        <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                            {title}
                        </h3>
                        <div className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                            {description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (href) {
        return (
            <li className={cn("min-h-[14rem] list-none", area)}>
                <Link href={href} className="block h-full group">
                    {content}
                </Link>
            </li>
        );
    }

    return (
        <li className={cn("min-h-[14rem] list-none", area)}>
            {content}
        </li>
    );
};
