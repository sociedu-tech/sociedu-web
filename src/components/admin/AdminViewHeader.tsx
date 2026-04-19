'use client';

import React from 'react';

export function AdminViewHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-6">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {description ? <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p> : null}
    </header>
  );
}
