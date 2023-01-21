<section
  class="card bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl p-8 max-w-none overscroll-x-contain"
>
  <slot name="header" />
  <h1
    class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
  >
    <slot name="title" />
  </h1>
  <div
    class="relative inline-flex overflow-x-scroll whitespace-nowrap w-auto gap-6 p-4 pb-6"
  >
    <slot name="content" />
  </div>
</section>
