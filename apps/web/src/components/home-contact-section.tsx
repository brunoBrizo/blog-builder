'use client';

import { ChevronDown, Link2, Mail, MessageSquare, Send } from 'lucide-react';
import { FormEvent, useId } from 'react';

import { homeContact } from '@/lib/home-page-content';

export function HomeContactSection() {
  const id = useId();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section
      id="contact"
      className="scroll-mt-24"
      aria-labelledby="home-contact-heading"
    >
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-zinc-200/60 pb-6 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-normal tracking-widest text-zinc-400 uppercase">
            <MessageSquare
              className="size-4 text-pink-500"
              strokeWidth={1.5}
              aria-hidden
            />
            <span>Get in touch</span>
          </div>
          <h2
            id="home-contact-heading"
            className="font-display text-3xl font-medium tracking-tight text-zinc-900 lg:text-4xl"
          >
            {homeContact.title}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:ring-offset-4 focus-within:ring-offset-[#FAFAFA] sm:p-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <h3 className="mb-4 font-display text-2xl font-normal tracking-tight text-zinc-900">
              {homeContact.subheading}
            </h3>
            <p className="mb-8 text-base font-light leading-relaxed text-zinc-500">
              {homeContact.body}
            </p>

            <div className="mt-auto space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                  <Link2
                    className="size-4 text-blue-600"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-900">
                    LinkedIn
                  </h4>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm font-light text-zinc-500 transition-colors hover:text-blue-600"
                  >
                    {homeContact.linkedInHandle}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-100 bg-violet-50">
                  <Mail
                    className="size-4 text-violet-600"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-900">Email</h4>
                  <p className="mt-1 text-sm font-light text-zinc-500">
                    {homeContact.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${id}-first-name`}
                  className="text-sm font-medium text-zinc-900"
                >
                  First name
                </label>
                <input
                  id={`${id}-first-name`}
                  name="firstName"
                  type="text"
                  placeholder="John"
                  required
                  className="w-full rounded-md border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-light text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${id}-last-name`}
                  className="text-sm font-medium text-zinc-900"
                >
                  Last name
                </label>
                <input
                  id={`${id}-last-name`}
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  required
                  className="w-full rounded-md border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-light text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${id}-email`}
                className="text-sm font-medium text-zinc-900"
              >
                Email address
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                autoComplete="email"
                className="w-full rounded-md border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-light text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${id}-topic`}
                className="text-sm font-medium text-zinc-900"
              >
                Topic
              </label>
              <div className="relative">
                <select
                  id={`${id}-topic`}
                  name="topic"
                  className="w-full appearance-none rounded-md border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-light text-zinc-900 shadow-sm transition-all focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
                  defaultValue="General Inquiry"
                >
                  <option>General Inquiry</option>
                  <option>Sponsorship</option>
                  <option>Guest Posting</option>
                  <option>Feedback</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                  <ChevronDown
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${id}-message`}
                className="text-sm font-medium text-zinc-900"
              >
                Message
              </label>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={4}
                placeholder="How can we help you?"
                required
                className="w-full resize-none rounded-md border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-2.5 text-sm font-light text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 self-start rounded-md bg-zinc-900 px-6 py-3 text-sm font-normal text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA] focus-visible:outline-none sm:w-auto"
            >
              Send Message
              <Send className="size-4" strokeWidth={1.5} aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
