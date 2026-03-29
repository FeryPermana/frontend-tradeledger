<template>
    <div class="min-h-screen bg-slate-950 text-slate-100">
        <PromoModal v-model="showPromoModal" @close="handlePromoClose" />

        <!-- Header -->
        <header class="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                <RouterLink to="/" class="flex items-center gap-3 sm:items-center">
                    <img :src="logo" alt="TradeLedger Logo" class="h-10 w-auto object-contain" />

                    <div class="flex flex-col justify-center">
                        <div class="hidden text-lg font-semibold tracking-tight text-white sm:block">
                            TradeLedger
                        </div>

                        <p class="text-xs text-slate-400">Track. Analyze. Grow.</p>
                    </div>
                </RouterLink>

                <nav class="hidden items-center gap-8 md:flex">
                    <a href="#features" class="text-sm text-slate-300 transition hover:text-white">Features</a>
                    <a href="#principles" class="text-sm text-slate-300 transition hover:text-white">Principles</a>
                    <a href="#pricing" class="text-sm text-slate-300 transition hover:text-white">Pricing</a>
                    <a href="#faq" class="text-sm text-slate-300 transition hover:text-white">FAQ</a>
                </nav>

                <div class="hidden items-center gap-3 md:flex">
                    <RouterLink to="/login"
                        class="inline-flex rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-900">
                        Login
                    </RouterLink>
                    <RouterLink to="/register"
                        class="inline-flex rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                        Start Free
                    </RouterLink>
                </div>

                <button type="button"
                    class="inline-flex items-center justify-center rounded-xl border border-slate-700 p-2 text-slate-200 transition hover:bg-slate-900 md:hidden"
                    @click="mobileMenuOpen = !mobileMenuOpen">
                    <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>

                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Mobile menu -->
            <div v-if="mobileMenuOpen" class="border-t border-slate-800 bg-slate-950 md:hidden">
                <div class="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4">
                    <a href="#features"
                        class="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
                        @click="closeMobileMenu">
                        Features
                    </a>
                    <a href="#principles"
                        class="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
                        @click="closeMobileMenu">
                        Principles
                    </a>
                    <a href="#pricing"
                        class="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
                        @click="closeMobileMenu">
                        Pricing
                    </a>
                    <a href="#faq"
                        class="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
                        @click="closeMobileMenu">
                        FAQ
                    </a>

                    <div class="mt-3 grid grid-cols-2 gap-3">
                        <RouterLink to="/login"
                            class="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
                            @click="closeMobileMenu">
                            Login
                        </RouterLink>
                        <RouterLink to="/register"
                            class="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                            @click="closeMobileMenu">
                            Start Free
                        </RouterLink>
                    </div>
                </div>
            </div>
        </header>

        <main>
            <!-- Hero -->
            <section class="relative overflow-hidden">
                <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_35%)]">
                </div>
                <div
                    class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent">
                </div>

                <div
                    class="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
                    <div>
                        <span
                            class="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                            Syariah-friendly • Spot only • No leverage
                        </span>

                        <h1
                            class="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Track your trades. Analyze your performance. Grow your capital.
                        </h1>

                        <p class="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                            TradeLedger is your trading and investment operating system - built to help you stay
                            disciplined, review what works, and make better decisions with clearer records.
                        </p>

                        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                            <RouterLink to="/register"
                                class="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                                Start Free
                            </RouterLink>

                            <a href="#pricing"
                                class="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900">
                                View Pricing
                            </a>
                        </div>

                        <div class="mt-8 grid max-w-xl grid-cols-1 gap-3 text-sm text-slate-400 sm:grid-cols-3">
                            <div class="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                                <div class="font-semibold text-white">Know your real performance</div>
                                <div class="mt-1">See results with more clarity.</div>
                            </div>
                            <div class="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                                <div class="font-semibold text-white">Understand what works</div>
                                <div class="mt-1">Review strategies and setups.</div>
                            </div>
                            <div class="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                                <div class="font-semibold text-white">Grow with discipline</div>
                                <div class="mt-1">Stay structured over time.</div>
                            </div>
                        </div>
                    </div>

                    <div class="relative">
                        <div class="absolute -inset-4 rounded-[2rem] bg-cyan-500/10 blur-3xl"></div>
                        <div
                            class="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/70 shadow-2xl">
                            <img :src="heroBanner" alt="TradeLedger dashboard preview"
                                class="h-full w-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- App Demo Slider -->
            <section class="border-t border-slate-900">
                <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div class="mx-auto max-w-3xl text-center">
                        <h2 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Explore the TradeLedger interface
                        </h2>
                        <p class="mt-4 text-base leading-7 text-slate-400">
                            Preview dashboard, analytics, portfolio, and trading journal in one workflow.
                        </p>
                    </div>

                    <div ref="sliderWrapper"
                        class="relative mx-auto mt-12 max-w-5xl cursor-grab active:cursor-grabbing select-none"
                        @mouseenter="pauseSlider" @mouseleave="startSlider" @mousedown="startDrag" @mousemove="onDrag"
                        @mouseup="endDrag" @mouseleave.capture="endDrag" @touchstart.passive="startDrag"
                        @touchmove.passive="onDrag" @touchend="endDrag">
                        <div class="absolute -inset-4 rounded-[2rem] bg-cyan-500/10 blur-3xl"></div>

                        <div
                            class="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/70 shadow-2xl">
                            <div class="flex transition-transform duration-500 ease-out"
                                :class="{ 'transition-none': isDragging }"
                                :style="{ transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))` }">
                                <div v-for="(slide, index) in demoSlides" :key="index" class="w-full shrink-0">
                                    <div class="bg-slate-950 px-4 pt-4 sm:px-6 sm:pt-6">
                                        <div
                                            class="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950">
                                            <img :src="slide.image" :alt="slide.title"
                                                class="mx-auto h-auto max-h-[220px] w-full object-contain transition duration-700 ease-out hover:scale-[1.03] sm:max-h-[420px] lg:max-h-[520px]"
                                                :class="currentSlide === index ? 'scale-100 opacity-100' : 'scale-95 opacity-70'"
                                                draggable="false" />
                                        </div>
                                    </div>

                                    <div class="px-5 py-5 sm:px-6 sm:py-6">
                                        <div class="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 class="text-xl font-semibold text-white">{{ slide.title }}</h3>
                                                <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                                    {{ slide.description }}
                                                </p>
                                            </div>

                                            <div class="shrink-0 text-sm font-medium text-cyan-300">
                                                {{ index + 1 }} / {{ demoSlides.length }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Dots -->
                        <div class="mt-6 flex justify-center gap-2">
                            <button v-for="(slide, index) in demoSlides" :key="slide.title"
                                class="h-2.5 rounded-full transition-all duration-300"
                                :class="currentSlide === index ? 'w-8 bg-cyan-400' : 'w-2.5 bg-slate-600 hover:bg-slate-500'"
                                @click="goToSlide(index)" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Value -->
            <section class="border-t border-slate-900">
                <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div class="mx-auto max-w-3xl text-center">
                        <span class="text-sm font-medium text-cyan-300">Why TradeLedger</span>
                        <h2 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Better decisions usually come from better records.
                        </h2>
                        <p class="mt-4 text-base leading-7 text-slate-400">
                            When trades, portfolio movements, and review notes are scattered, progress becomes harder to
                            read. TradeLedger helps you keep everything in one structured workflow.
                        </p>
                    </div>

                    <div class="mt-12 grid gap-6 md:grid-cols-3">
                        <div class="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                            <h3 class="text-lg font-semibold text-white">Track consistently</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-400">
                                Record entries, exits, fees, and investment activity without relying on memory.
                            </p>
                        </div>

                        <div class="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                            <h3 class="text-lg font-semibold text-white">Review clearly</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-400">
                                See which setups perform better and which habits need improvement.
                            </p>
                        </div>

                        <div class="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                            <h3 class="text-lg font-semibold text-white">Manage capital better</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-400">
                                Connect trade results with portfolio impact and stay closer to the real picture.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features -->
            <section id="features" class="border-t border-slate-900">
                <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div class="max-w-2xl">
                        <span class="text-sm font-medium text-cyan-300">Core features</span>
                        <h2 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            One workflow for tracking, reviewing, and improving.
                        </h2>
                        <p class="mt-4 text-base leading-7 text-slate-400">
                            Built for traders and investors who want a cleaner system for journaling, analytics, and
                            portfolio management.
                        </p>
                    </div>

                    <div class="mt-12 grid gap-6 lg:grid-cols-2">
                        <div class="rounded-3xl border border-slate-800 bg-slate-900 p-7">
                            <h3 class="text-xl font-semibold text-white">Trade Journal</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-400">
                                Record entries, exits, notes, fees, and partial close activity with a clean trading log.
                            </p>
                            <ul class="mt-5 space-y-3 text-sm text-slate-300">
                                <li>• PnL tracking in Rp or USD</li>
                                <li>• Partial close support</li>
                                <li>• Fee-aware calculation</li>
                                <li>• Clean trade history</li>
                            </ul>
                        </div>

                        <div class="rounded-3xl border border-slate-800 bg-slate-900 p-7">
                            <h3 class="text-xl font-semibold text-white">Portfolio Tracking</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-400">
                                Organize accounts, assets, and portfolio records while keeping trade history connected.
                            </p>
                            <ul class="mt-5 space-y-3 text-sm text-slate-300">
                                <li>• Multi-account support</li>
                                <li>• Asset management</li>
                                <li>• Trade to portfolio sync</li>
                                <li>• Current price support</li>
                            </ul>
                        </div>

                        <div class="rounded-3xl border border-slate-800 bg-slate-900 p-7">
                            <h3 class="text-xl font-semibold text-white">Strategy Review</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-400">
                                Measure setup performance with clearer numbers instead of relying on intuition.
                            </p>
                            <ul class="mt-5 space-y-3 text-sm text-slate-300">
                                <li>• Strategy-based grouping</li>
                                <li>• Tag performance visibility</li>
                                <li>• Best and worst setup insights</li>
                                <li>• More disciplined review</li>
                            </ul>
                        </div>

                        <div class="rounded-3xl border border-slate-800 bg-slate-900 p-7">
                            <h3 class="text-xl font-semibold text-white">Analytics Dashboard</h3>
                            <p class="mt-3 text-sm leading-6 text-slate-400">
                                Review performance through a dashboard designed to stay informative and easy to read.
                            </p>
                            <ul class="mt-5 space-y-3 text-sm text-slate-300">
                                <li>• Win rate and total trades</li>
                                <li>• Net profit overview</li>
                                <li>• Strategy and tag breakdown</li>
                                <li>• Structured summary cards</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Principles -->
            <section id="principles" class="border-t border-slate-900">
                <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
                        <div>
                            <span class="text-sm font-medium text-cyan-300">Trading principles</span>
                            <h2 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Built around a more conservative, spot-focused approach.
                            </h2>
                            <p class="mt-4 text-base leading-7 text-slate-400">
                                TradeLedger is designed for users who prefer real-asset participation, clearer risk
                                boundaries, and a more structured workflow.
                            </p>
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                                <h3 class="font-semibold text-emerald-300">Spot-oriented</h3>
                                <p class="mt-2 text-sm leading-6 text-slate-300">
                                    Focused on a clearer ownership-based mindset.
                                </p>
                            </div>

                            <div class="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                                <h3 class="font-semibold text-white">No leverage</h3>
                                <p class="mt-2 text-sm leading-6 text-slate-400">
                                    Designed for users who prefer discipline without borrowed exposure.
                                </p>
                            </div>

                            <div class="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                                <h3 class="font-semibold text-white">No CFD</h3>
                                <p class="mt-2 text-sm leading-6 text-slate-400">
                                    Avoid synthetic contract structures that blur actual ownership.
                                </p>
                            </div>

                            <div class="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                                <h3 class="font-semibold text-white">No short selling</h3>
                                <p class="mt-2 text-sm leading-6 text-slate-400">
                                    Kept aligned with a more conservative and structured framework.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Pricing -->
            <section id="pricing" class="border-t border-slate-900">
                <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div class="mx-auto max-w-3xl text-center">
                        <span class="text-sm font-medium text-cyan-300">Pricing</span>
                        <h2 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Simple pricing for serious usage.
                        </h2>
                        <p class="mt-4 text-base leading-7 text-slate-400">
                            Start free, then choose Pro when you want a more complete review workflow.
                        </p>
                    </div>

                    <div class="mt-12 grid gap-6 lg:grid-cols-2">
                        <div class="rounded-3xl border border-slate-800 bg-slate-900 p-8">
                            <div class="flex items-center justify-between">
                                <h3 class="text-2xl font-semibold text-white">Free</h3>
                                <span
                                    class="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Entry</span>
                            </div>

                            <div class="mt-6">
                                <span class="text-4xl font-bold text-white">Rp 0</span>
                            </div>

                            <p class="mt-4 text-sm leading-6 text-slate-400">
                                Good for trying the workflow and starting a basic journal.
                            </p>

                            <ul class="mt-6 space-y-3 text-sm text-slate-300">
                                <li>• Basic trade journal</li>
                                <li>• Limited accounts</li>
                                <li>• Limited trades</li>
                                <li>• Basic tracking</li>
                            </ul>

                            <RouterLink to="/register?plan=free"
                                class="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800">
                                Start Free
                            </RouterLink>
                        </div>

                        <div
                            class="relative rounded-3xl border border-cyan-500/40 bg-slate-900 p-8 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]">
                            <div
                                class="absolute -top-3 left-8 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-slate-950">
                                Most Popular
                            </div>

                            <div class="flex items-center justify-between">
                                <h3 class="text-2xl font-semibold text-white">Pro</h3>
                                <span
                                    class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                                    Full access
                                </span>
                            </div>

                            <div class="mt-6 grid gap-4 sm:grid-cols-3">
                                <button type="button"
                                    class="rounded-2xl border p-4 text-left transition-all duration-200" :class="selectedPlan === '3_months'
                                        ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/40'
                                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'"
                                    @click="selectedPlan = '3_months'">
                                    <div class="flex items-center justify-between">
                                        <div class="text-sm text-slate-400">3 Months</div>
                                        <span class="text-[10px] font-semibold text-emerald-400">Starter</span>
                                    </div>
                                    <div class="mt-2 text-xl font-bold text-white">Rp 60.000</div>
                                </button>

                                <button type="button"
                                    class="relative rounded-2xl border p-4 text-left transition-all duration-200"
                                    :class="selectedPlan === '8_months'
                                        ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/40'
                                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'"
                                    @click="selectedPlan = '8_months'">
                                    <div class="flex items-center justify-between">
                                        <div class="text-sm text-slate-400">8 Months</div>
                                        <span class="text-[10px] font-semibold text-emerald-400">Smart Choice</span>
                                    </div>
                                    <div class="mt-2 text-xl font-bold text-white">Rp 150.000</div>
                                </button>

                                <button type="button"
                                    class="rounded-2xl border p-4 text-left transition-all duration-200" :class="selectedPlan === '12_months'
                                        ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/40'
                                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'"
                                    @click="selectedPlan = '12_months'">
                                    <div class="flex items-center justify-between">
                                        <div class="text-sm text-slate-400">1 Year</div>
                                        <span class="text-[10px] font-semibold text-emerald-400">Best Value</span>
                                    </div>
                                    <div class="mt-2 text-xl font-bold text-white">Rp 250.000</div>
                                </button>
                            </div>

                            <p class="mt-6 text-sm leading-6 text-slate-400">
                                For users who want deeper analytics, portfolio support, and a more complete review
                                process.
                            </p>

                            <ul class="mt-6 space-y-3 text-sm text-slate-300">
                                <li>• Unlimited trades</li>
                                <li>• Full analytics dashboard</li>
                                <li>• Strategy & tag performance</li>
                                <li>• Portfolio tracking</li>
                                <li>• Partial close support</li>
                                <li>• Current price support</li>
                                <li>• Priority updates</li>
                            </ul>

                            <RouterLink :to="`/register?plan=${selectedPlan}`"
                                class="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                                Upgrade to Pro
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FAQ -->
            <section id="faq" class="border-t border-slate-900">
                <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div class="mx-auto max-w-3xl text-center">
                        <span class="text-sm font-medium text-cyan-300">FAQ</span>
                        <h2 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Common questions
                        </h2>
                    </div>

                    <div class="mx-auto mt-12 max-w-4xl space-y-4">
                        <div v-for="item in faqs" :key="item.question"
                            class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                            <button type="button" class="flex w-full items-center justify-between gap-4 text-left"
                                @click="toggleFaq(item.question)">
                                <span class="text-lg font-semibold text-white">{{ item.question }}</span>
                                <span class="text-slate-400">{{ activeFaq === item.question ? '−' : '+' }}</span>
                            </button>

                            <p v-if="activeFaq === item.question" class="mt-3 text-sm leading-6 text-slate-400">
                                {{ item.answer }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- CTA -->
            <section class="border-t border-slate-900">
                <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div class="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 p-8 sm:p-10">
                        <div class="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
                            <div>
                                <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                    Start building a more structured trading record.
                                </h2>
                                <p class="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                                    Keep your trades, review your strategy performance, and manage portfolio activity in
                                    one focused workflow.
                                </p>
                            </div>

                            <div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
                                <RouterLink to="/register"
                                    class="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                                    Create Free Account
                                </RouterLink>

                                <RouterLink to="/login"
                                    class="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800">
                                    Login
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="border-t border-slate-900">
            <div
                class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <p>© 2026 TradeLedger. All rights reserved.</p>
                <div class="flex items-center gap-5">
                    <a href="#features" class="transition hover:text-slate-300">Features</a>
                    <a href="#pricing" class="transition hover:text-slate-300">Pricing</a>
                    <a href="#faq" class="transition hover:text-slate-300">FAQ</a>
                </div>
            </div>
        </footer>
    </div>

    <FloatingWhatsApp />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PromoModal from '@/components/PromoModal.vue'
import logo from '@/assets/logo.png'
import heroBanner from '@/assets/landing/hero-benner.png'
import demoDashboard1 from '@/assets/landing/demo-dashboard-1.png'
import demoDashboard2 from '@/assets/landing/demo-dashboard-2.png'
import demoTrades from '@/assets/landing/demo-trades.png'
import demoPortfolio from '@/assets/landing/demo-portfolio.png'
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp.vue'

const mobileMenuOpen = ref(false)
const selectedPlan = ref('8_months')
const activeFaq = ref('Is TradeLedger a trading platform?')
const showPromoModal = ref(false)
const currentSlide = ref(0)
const dragOffset = ref(0)
const sliderWrapper = ref(null)

const PROMO_STORAGE_KEY = 'tradeledger_promo_modal_closed'

const faqs = [
    {
        question: 'Is TradeLedger a trading platform?',
        answer:
            'No. TradeLedger is a journal and analytics app for tracking trades, reviewing strategies, and managing portfolio records.',
    },
    {
        question: 'Do you support leverage, CFD, or short selling?',
        answer:
            'TradeLedger is positioned around a spot-focused and more conservative workflow, so it does not center its framework on leverage, CFD, or short selling.',
    },
    {
        question: 'Who is this for?',
        answer:
            'It is built for traders and investors who want to keep cleaner records, review habits, and evaluate performance with more structure.',
    },
    {
        question: 'Can beginners use it?',
        answer:
            'Yes. The interface is designed to stay approachable for beginners while still useful for more serious users.',
    },
]

const demoSlides = [
    {
        image: demoDashboard1,
        title: 'Dashboard Overview',
        description: 'Monitor total trades, win rate, net profit, profit factor, and strategy insights.',
    },
    {
        image: demoDashboard2,
        title: 'Analytics & Monthly Performance',
        description: 'View monthly performance, tag performance, and portfolio snapshots with clarity.',
    },
    {
        image: demoTrades,
        title: 'Trade Journal',
        description: 'Track entry, exit, quantity, partial closes, and trade status in one clean table.',
    },
    {
        image: demoPortfolio,
        title: 'Portfolio Tracking',
        description: 'Monitor investment positions, average price, allocation, and asset growth.',
    },
]

let sliderInterval = null
let isDragging = false
let startX = 0

function closeMobileMenu() {
    mobileMenuOpen.value = false
}

function toggleFaq(question) {
    activeFaq.value = activeFaq.value === question ? '' : question
}

function handlePromoClose() {
    localStorage.setItem(PROMO_STORAGE_KEY, 'true')
}

function nextSlide() {
    currentSlide.value = (currentSlide.value + 1) % demoSlides.length
}

function prevSlide() {
    currentSlide.value = (currentSlide.value - 1 + demoSlides.length) % demoSlides.length
}

function goToSlide(index) {
    currentSlide.value = index
    resetSlider()
}

function startSlider() {
    stopSlider()
    sliderInterval = setInterval(() => {
        nextSlide()
    }, 4000)
}

function stopSlider() {
    if (sliderInterval) {
        clearInterval(sliderInterval)
        sliderInterval = null
    }
}

function pauseSlider() {
    stopSlider()
}

function resetSlider() {
    stopSlider()
    startSlider()
}

function getPointerX(event) {
    if (event.type.startsWith('mouse')) return event.clientX
    if (event.touches?.length) return event.touches[0].clientX
    if (event.changedTouches?.length) return event.changedTouches[0].clientX
    return 0
}

function startDrag(event) {
    isDragging = true
    startX = getPointerX(event)
    dragOffset.value = 0
    stopSlider()
}

function onDrag(event) {
    if (!isDragging) return
    const currentX = getPointerX(event)
    dragOffset.value = currentX - startX
}

function endDrag() {
    if (!isDragging) return

    if (dragOffset.value < -50) {
        nextSlide()
    } else if (dragOffset.value > 50) {
        prevSlide()
    }

    dragOffset.value = 0
    isDragging = false
    startSlider()
}

onMounted(() => {
    showPromoModal.value = true
    startSlider()
})

onUnmounted(() => {
    stopSlider()
})
</script>