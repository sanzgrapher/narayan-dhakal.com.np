class ProjectCarousel extends HTMLElement {
  #track: HTMLElement | null = null;
  #slides: HTMLElement[] = [];
  #dots: HTMLElement | null = null;
  /** Logical index into real slides (0..count-1). */
  #index = 0;
  #count = 0;
  #drag: { x: number; left: number; moved: boolean } | null = null;
  #jumping = false;
  #ignoreSync = false;

  connectedCallback() {
    this.#track = this.querySelector('[data-track]');
    this.#slides = [...this.querySelectorAll<HTMLElement>('[data-slide]')];
    this.#dots = this.querySelector('[data-dots]');
    this.#count = Number(this.dataset.count) || 0;
    if (!this.#track || this.#count <= 1) return;

    this.querySelector('[data-prev]')?.addEventListener('click', () => this.go(-1));
    this.querySelector('[data-next]')?.addEventListener('click', () => this.go(1));
    this.#track.addEventListener('scroll', () => this.#sync(), { passive: true });

    this.#track.addEventListener('pointerdown', (e) => this.#onDown(e));
    this.#track.addEventListener('pointermove', (e) => this.#onMove(e));
    this.#track.addEventListener('pointerup', (e) => this.#onUp(e));
    this.#track.addEventListener('pointercancel', () => this.#onCancel());
    this.#track.addEventListener(
      'click',
      (e) => {
        if (this.#drag?.moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );

    // Start on the first real slide (slot 1). Block sync while we jump so the
    // leading clone at scrollLeft 0 cannot steal us to the last slide.
    this.#ignoreSync = true;
    this.#track.classList.remove('scroll-smooth');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.#goTo(0, false);
        this.#paint();
        requestAnimationFrame(() => {
          this.#track?.classList.add('scroll-smooth');
          this.#ignoreSync = false;
        });
      });
    });
  }

  /** DOM slot for logical index: +1 for leading clone. */
  #slot(logical: number) {
    return logical + 1;
  }

  #logicalFromSlot(slot: number) {
    if (slot <= 0) return this.#count - 1;
    if (slot >= this.#count + 1) return 0;
    return slot - 1;
  }

  #onDown(e: PointerEvent) {
    if (!this.#track || e.button !== 0) return;
    this.#drag = { x: e.clientX, left: this.#track.scrollLeft, moved: false };
    this.#track.setPointerCapture(e.pointerId);
    this.#track.classList.remove('scroll-smooth');
  }

  #onMove(e: PointerEvent) {
    if (!this.#track || !this.#drag) return;
    const dx = e.clientX - this.#drag.x;
    if (Math.abs(dx) > 4) this.#drag.moved = true;
    this.#track.scrollLeft = this.#drag.left - dx;
  }

  #onUp(e: PointerEvent) {
    if (!this.#track || !this.#drag) return;
    const dx = e.clientX - this.#drag.x;
    const moved = this.#drag.moved;
    this.#drag = null;
    this.#track.classList.add('scroll-smooth');
    if (moved && Math.abs(dx) > 40) this.go(dx < 0 ? 1 : -1);
    else this.#settle();
  }

  #onCancel() {
    this.#drag = null;
    this.#track?.classList.add('scroll-smooth');
    this.#settle();
  }

  #nearestSlot() {
    if (!this.#track) return 1;
    const mid = this.#track.getBoundingClientRect().left + this.#track.clientWidth / 2;
    let best = 1;
    let bestDist = Infinity;
    this.#slides.forEach((slide, i) => {
      const r = slide.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  #scrollToSlot(slot: number, smooth: boolean) {
    const slide = this.#slides[slot];
    if (!this.#track || !slide) return;
    const track = this.#track;
    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const delta =
      slideRect.left + slideRect.width / 2 - (trackRect.left + track.clientWidth / 2);
    track.scrollTo({
      left: track.scrollLeft + delta,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  #goTo(logical: number, smooth: boolean) {
    this.#index = ((logical % this.#count) + this.#count) % this.#count;
    this.#scrollToSlot(this.#slot(this.#index), smooth);
    this.#paint();
  }

  /** After drag/scroll: snap, then jump off clones onto real slides. */
  #settle() {
    const slot = this.#nearestSlot();
    const clone = this.#slides[slot]?.dataset.clone;
    if (clone === 'end') {
      this.#jumpTo(this.#count - 1);
      return;
    }
    if (clone === 'start') {
      this.#jumpTo(0);
      return;
    }
    this.#index = this.#logicalFromSlot(slot);
    this.#scrollToSlot(slot, true);
    this.#paint();
  }

  #jumpTo(logical: number) {
    if (!this.#track) return;
    this.#jumping = true;
    this.#ignoreSync = true;
    this.#track.classList.remove('scroll-smooth');
    this.#goTo(logical, false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.#track?.classList.add('scroll-smooth');
        this.#jumping = false;
        this.#ignoreSync = false;
      });
    });
  }

  go(delta: number) {
    if (!this.#track) return;
    // Animate through edge clones so wrap feels continuous, then jump.
    if (delta < 0 && this.#index === 0) {
      this.#index = this.#count - 1;
      this.#paint();
      this.#scrollToSlot(0, true);
      this.#afterSmooth(() => this.#jumpTo(this.#count - 1));
      return;
    }
    if (delta > 0 && this.#index === this.#count - 1) {
      this.#index = 0;
      this.#paint();
      this.#scrollToSlot(this.#count + 1, true);
      this.#afterSmooth(() => this.#jumpTo(0));
      return;
    }
    this.#goTo(this.#index + delta, true);
  }

  #afterSmooth(fn: () => void) {
    const track = this.#track;
    if (!track) return;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      track.removeEventListener('scrollend', finish);
      clearTimeout(fallback);
      fn();
    };
    const fallback = setTimeout(finish, 400);
    track.addEventListener('scrollend', finish, { once: true });
  }

  #sync() {
    if (this.#jumping || this.#ignoreSync || this.#drag) return;
    const slot = this.#nearestSlot();
    const clone = this.#slides[slot]?.dataset.clone;
    // Only teleport off a clone once it is clearly centered (user finished a wrap).
    if (clone === 'end' || clone === 'start') {
      const slide = this.#slides[slot];
      if (!this.#track || !slide) return;
      const mid = this.#track.getBoundingClientRect().left + this.#track.clientWidth / 2;
      const r = slide.getBoundingClientRect();
      if (Math.abs(r.left + r.width / 2 - mid) > 8) return;
      this.#jumpTo(clone === 'end' ? this.#count - 1 : 0);
      return;
    }
    const logical = this.#logicalFromSlot(slot);
    if (logical !== this.#index) {
      this.#index = logical;
      this.#paint();
    }
  }

  #paint() {
    if (this.#dots) this.#dots.textContent = `${this.#index + 1} / ${this.#count}`;
    this.#slides.forEach((slide, slot) => {
      const active = this.#logicalFromSlot(slot) === this.#index;
      slide.classList.toggle('opacity-100', active);
      slide.classList.toggle('opacity-55', !active);
    });
  }
}

if (!customElements.get('project-carousel')) {
  customElements.define('project-carousel', ProjectCarousel);
}
