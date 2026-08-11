<template>
  <div class="flex flex-col min-h-screen">
    <header class="flex items-center justify-end px-6 py-3">
      <LanguageSwitcher />
    </header>

    <main class="flex flex-1 items-center justify-center p-6">
      <slot />
    </main>
  </div>
</template>
