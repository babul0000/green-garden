"use client";

import React from "react";
import { INavbarConfig, IMenuLink } from "./types";
import NavDrawerHeader from "./NavDrawerHeader";
import NavDrawerLinks from "./NavDrawerLinks";
import NavDrawerQuickActions from "./NavDrawerQuickActions";
import NavDrawerUserCard from "./NavDrawerUserCard";
import NavDrawerFooter from "./NavDrawerFooter";

interface NavMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: INavbarConfig;
  visibleMenuLinks: IMenuLink[];
  pathname: string;
  isHomePage: boolean;
  rotateDeg: number;
  onToggleLang: () => void;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
  onTriggerEstimator: () => void;
  onTriggerTreeDoctor: () => void;
  user: any;
  onLogout: () => void;
  whatsappLink: string;
}

export default function NavMenuDrawer({
  isOpen,
  onClose,
  config,
  visibleMenuLinks,
  pathname,
  isHomePage,
  rotateDeg,
  onToggleLang,
  onLinkClick,
  onTriggerEstimator,
  onTriggerTreeDoctor,
  user,
  onLogout,
  whatsappLink,
}: NavMenuDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex animate-fade-in" role="dialog" aria-modal="true">
      {/* Backdrop Overlay with Ambient Blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer transition-opacity duration-300"
        aria-hidden="true"
      ></div>

      {/* Left Slide Menu Container: Exact Shma Signature Linen / Off-White Tone */}
      <div className="relative w-full max-w-[480px] bg-[#E4E2D7] text-[#323232] h-full max-h-screen overflow-y-auto overscroll-contain px-6 sm:px-10 py-8 flex flex-col justify-between z-10 shadow-2xl border-r border-[#D6D2C4] animate-slide-right">
        
        {/* 1. Header (Hamburger close, rotating language toggle, ✕ button) */}
        <NavDrawerHeader
          onClose={onClose}
          rotateDeg={rotateDeg}
          onToggleLang={onToggleLang}
        />

        {/* 2. Menu Links, Quick Actions & Auth Card */}
        <div className="space-y-6 my-auto py-2">
          {/* Main Navigation Links */}
          <NavDrawerLinks
            links={visibleMenuLinks}
            pathname={pathname}
            isHomePage={isHomePage}
            onLinkClick={onLinkClick}
            onClose={onClose}
          />

          {/* Quick Actions (3D Wizard, Estimator, Tree Doctor) */}
          <NavDrawerQuickActions
            enable3dWizardLink={config.enable3dWizardLink}
            enableEmergencyDoctor={config.enableEmergencyDoctor}
            onTriggerEstimator={onTriggerEstimator}
            onTriggerTreeDoctor={onTriggerTreeDoctor}
            onClose={onClose}
          />

          {/* User Auth / Dashboard Profile Card */}
          <NavDrawerUserCard
            user={user}
            onLogout={onLogout}
            onClose={onClose}
          />
        </div>

        {/* 3. Studio Coordinates & Contact Footer */}
        <NavDrawerFooter
          hotlineDisplay={config.hotlineDisplay}
          hotlinePhone={config.hotlinePhone}
          whatsappLink={whatsappLink}
        />

      </div>
    </div>
  );
}
