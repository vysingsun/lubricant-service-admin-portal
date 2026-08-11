<template>
  <div class="flex h-screen">
    <AppSidebar />

    <div class="flex flex-col flex-1 min-w-0">
      <header class="flex items-center justify-between border-b border-default px-6 py-3">
        <StoreSwitcher />
        <LanguageSwitcher />
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
