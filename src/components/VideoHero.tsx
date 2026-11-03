"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, MessageCircle, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";


export default function VideoHero() {
  const { t, language } = useCustomerLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const modelCanvasRef = useRef<HTMLCanvasElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);

  useEffect(() => {
    const canvas = modelCanvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.2, 4.8);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setModelError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9aabc4, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x9bbfff, 2.1);
    rimLight.position.set(-4, 1, -3);
    scene.add(rimLight);
    const modelRoot = new THREE.Group();
    scene.add(modelRoot);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2.7;
    controls.maxDistance = 7;
    controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotateSpeed = 0.7;
    new GLTFLoader().load("/models/phone-repair.glb", (gltf) => {
      const model = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const scale = 2.35 / (Math.max(size.x, size.y, size.z) || 1);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      modelRoot.add(model);
      setModelLoaded(true);
    }, undefined, () => setModelError(true));
    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    let animationId = 0;
    const render = () => {
      animationId = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationId);
      observer.disconnect();
      controls.dispose();
      modelRoot.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-story-kicker]", { y: 14, autoAlpha: 0, duration: 0.5 })
        .from("[data-story-title]", { y: 30, autoAlpha: 0, duration: 0.8 }, "-=0.22")
        .from("[data-story-copy]", { y: 18, autoAlpha: 0, duration: 0.55 }, "-=0.34")
        .from("[data-story-actions]", { y: 14, autoAlpha: 0, duration: 0.5 }, "-=0.24")
        .from("[data-story-model]", { y: 32, scale: 0.975, autoAlpha: 0, duration: 0.9 }, "-=0.28");

      gsap.to("[data-story-glow]", {
        y: 28,
        x: -12,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to("[data-story-model]", {
        yPercent: 2,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  const hi = language === "hi";

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="customer-hero relative isolate overflow-hidden px-4 pb-10 pt-[6.4rem] sm:px-8 sm:pb-16 sm:pt-36 lg:px-12 lg:pb-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,#f8faff_0%,#f3f6fc_55%,#fbfcff_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-24 -z-10 size-[26rem] rounded-full bg-[#c9dcff]/45 blur-[110px]" />
      <div aria-hidden="true" data-story-glow className="pointer-events-none absolute -right-28 top-44 -z-10 size-[30rem] rounded-full bg-[#d9d0ff]/45 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="mx-auto max-w-[1240px]">
        <div className="grid items-center gap-8 lg:grid-cols-[.88fr_1.12fr] lg:gap-12">
          <div className="relative z-10 text-center lg:text-left">
            <p data-story-kicker className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[.2em] text-[#31547c] shadow-[0_8px_28px_rgba(32,56,96,.07)] backdrop-blur-2xl sm:text-[10px]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              {t("heroKicker")}
            </p>

            <h1
              id="hero-heading"
              data-story-title
              className="mx-auto max-w-[720px] text-[clamp(2.75rem,6.2vw,5.8rem)] font-semibold leading-[.98] tracking-[-.075em] text-[#101827] lg:mx-0"
            >
              {hi ? (
                <>Phone sirf phone nahi.<br /><span className="bg-gradient-to-r from-[#1769d2] via-[#4779d5] to-[#7b65ca] bg-clip-text text-transparent">Aapki duniya hai.</span></>
              ) : (
                <>It’s more than a phone.<br /><span className="bg-gradient-to-r from-[#1769d2] via-[#4779d5] to-[#7b65ca] bg-clip-text text-transparent">It’s your world.</span></>
              )}
            </h1>

            <p data-story-copy className="mx-auto mt-5 max-w-[540px] text-sm font-medium leading-7 text-[#667085] sm:text-base sm:leading-8 lg:mx-0">
              {hi
                ? "Mobile repair karwana hai, naya phone kharidna hai ya apna purana phone bechna hai? Neeche apna kaam chunein — hum aapki madad karenge."
                : "Need a phone repair, want to buy a phone, or planning to sell your old one? Choose what you need below and we’ll help you get started."}
            </p>

            <div data-story-actions className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={scrollToServices}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1769d2] px-7 text-sm font-bold text-white shadow-[0_14px_34px_rgba(23,105,210,.24)] transition duration-500 hover:-translate-y-1 hover:bg-[#1059b7] hover:shadow-[0_20px_42px_rgba(23,105,210,.3)] active:scale-[.98]"
              >
                {t("chooseWork")} <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="https://wa.me/919131383323"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/90 bg-white/65 px-7 text-sm font-bold text-[#26364b] shadow-[0_8px_28px_rgba(32,56,96,.06)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:bg-white"
              >
                <MessageCircle size={17} /> {t("whatsapp")}
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-bold text-[#68778b] sm:text-[11px] lg:justify-start">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> {t("easyBooking")}</span>
              <span className="inline-flex items-center gap-1.5"><Smartphone size={14} className="text-[#1769d2]" /> {t("buySellRepair")}</span>
            </div>
          </div>

          <div data-story-model className="relative mx-auto w-full max-w-[720px] lg:max-w-none">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-5 rounded-[36px] bg-gradient-to-br from-white/80 via-[#dce8ff]/50 to-[#e9e2ff]/60 blur-2xl" />
            <div className="relative overflow-hidden rounded-[26px] border border-white/90 bg-[#e8edf5] p-1.5 shadow-[0_32px_90px_rgba(27,47,83,.16),inset_0_1px_0_rgba(255,255,255,.95)] sm:rounded-[34px] sm:p-2">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] bg-[radial-gradient(ellipse_at_50%_40%,#fff_0%,#e9eff9_52%,#dce5f2_100%)] sm:rounded-[27px]">
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_50%_50%,transparent_45%,rgba(30,48,78,.08)_100%)]" />
                <canvas ref={modelCanvasRef} aria-label={hi ? "Phone repair ka interactive 3D model. Ghumane ke liye drag karein aur zoom ke liye scroll ya pinch karein." : "Interactive local phone repair 3D model. Drag to rotate and scroll or pinch to zoom."} className="absolute inset-0 h-full w-full touch-pan-y" />
                {!modelLoaded && !modelError && (
                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_50%_35%,#fff_0%,#e9eff9_58%,#dce5f2_100%)] px-6 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-white bg-white/70 text-[#4774b5] shadow-lg shadow-blue-950/5 backdrop-blur-xl"><Sparkles size={24} strokeWidth={1.5} /></div>
                    <div>
                      <p className="text-sm font-bold text-[#24344c]">{hi ? "Aapka 3D phone model load ho raha hai…" : "Loading your 3D phone model…"}</p>
                      <p className="mt-1 text-[10px] font-medium text-[#75839a]">{hi ? "Model aapki website se load hota hai." : "Loaded directly from this website."}</p>
                    </div>
                  </div>
                )}
                {modelError && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-[#edf2fa] px-6 text-center">
                    <Smartphone size={30} className="text-[#4774b5]" />
                    <p className="text-sm font-bold text-[#24344c]">{hi ? "3D model load nahi hua" : "3D model could not be loaded"}</p>
                    <p className="max-w-xs text-[10px] leading-5 text-[#75839a]">{hi ? "public/models/phone-repair.glb file check karein." : "Check that public/models/phone-repair.glb exists."}</p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-3 bottom-3 z-30 flex items-center justify-between gap-2 sm:inset-x-5 sm:bottom-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-[9px] font-bold tracking-wide text-[#31445f] shadow-lg backdrop-blur-xl sm:text-[10px]">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {hi ? "LOCAL 3D MODEL · GHUMAKAR DEKHEIN" : "LOCAL 3D MODEL · EXPLORE IT"}
                  </span>

                </div>
              </div>
            </div>
            <div className="mx-auto mt-4 flex max-w-[560px] items-center justify-center gap-3 text-center text-[10px] font-semibold leading-5 text-[#8290a3] sm:text-[11px]">
              <ArrowDown size={14} className="shrink-0" />
              <span>{hi ? "Ghumayein: model par drag karein · Zoom: pinch ya scroll karein." : "Rotate: drag the model · Zoom: pinch or scroll."}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-2.5 border-t border-[#dce4f0]/80 pt-5 sm:mt-14 sm:grid-cols-3 sm:gap-4 sm:pt-7">
          {(hi
            ? [
                { n: "01", title: "Phone repair", copy: "Phone mein problem hai? Repair option chunein." },
                { n: "02", title: "Buy a phone", copy: "Naya ya doosra phone chahiye? Buy chunein." },
                { n: "03", title: "Sell your phone", copy: "Purana phone bechna hai? Sell chunein." },
              ]
            : [
                { n: "01", title: "Repair a phone", copy: "Something wrong? Choose the repair option." },
                { n: "02", title: "Buy a phone", copy: "Looking for another phone? Choose buy." },
                { n: "03", title: "Sell your phone", copy: "Want to sell your old phone? Choose sell." },
              ]
          ).map((step) => (
            <div key={step.n} className="flex items-start gap-3 rounded-2xl border border-white/75 bg-white/45 px-4 py-3 backdrop-blur-xl sm:border-transparent sm:bg-transparent sm:px-2">
              <span className="pt-0.5 text-[10px] font-extrabold tracking-[.14em] text-[#7a91b1]">{step.n}</span>
              <div>
                <p className="text-xs font-extrabold text-[#26364b] sm:text-sm">{step.title}</p>
                <p className="mt-1 text-[10px] leading-4 text-[#7b8798] sm:text-xs">{step.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
