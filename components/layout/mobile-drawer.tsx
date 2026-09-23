/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import {
  CloseCircleFilled,
  CloseOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Avatar, Menu } from "antd";
import { ItemType } from "antd/lib/menu/interface";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

import styles from "./mobile-drawer.module.scss";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  user?: any;
  selectedCustomerName?: string;
  selectedWarehouseName?: string;
  sideMenu: any[];
  selectedKeys: string[];
  openKeys: string[];
  setOpenKeys: React.Dispatch<React.SetStateAction<string[]>>;
  onMenuChange: (params: any) => void;
  headerMenu?: ItemType[];
}

// Helper to extract string from ReactNode label
function getLabelString(label: any): string {
  if (typeof label === "string") return label;
  if (
    label &&
    typeof label === "object" &&
    label.props &&
    label.props.children
  ) {
    return getLabelString(label.props.children);
  }
  if (Array.isArray(label)) {
    return label.map(getLabelString).join(" ");
  }
  return "";
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  onClose,
  user,
  selectedCustomerName,
  selectedWarehouseName,
  sideMenu,
  selectedKeys,
  openKeys,
  setOpenKeys,
  onMenuChange,
  headerMenu: _headerMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSearchQuery(""); // reset search on close
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Filter menu based on search query
  const { filteredMenu, autoOpenKeys } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return { filteredMenu: sideMenu, autoOpenKeys: [] };
    }

    const matchedKeys: string[] = [];

    const filterItems = (items: any[]): any[] => {
      return items.reduce((acc: any[], item: any) => {
        const itemLabel = getLabelString(item.label).toLowerCase();
        const matchesCurrent = itemLabel.includes(query);

        if (item.children && item.children.length > 0) {
          const matchedChildren = filterItems(item.children);
          if (matchesCurrent || matchedChildren.length > 0) {
            matchedKeys.push(item.key);
            acc.push({
              ...item,
              children:
                matchedChildren.length > 0 ? matchedChildren : item.children,
            });
          }
        } else if (matchesCurrent) {
          acc.push(item);
        }
        return acc;
      }, []);
    };

    const results = filterItems(sideMenu);
    return { filteredMenu: results, autoOpenKeys: matchedKeys };
  }, [sideMenu, searchQuery]);

  return (
    <div
      className={`${styles["mobile-drawer-root"]}${
        open ? ` ${styles["open"]}` : ""
      }`}
      aria-hidden={!open}
    >
      {/* Frosted Glass Backdrop */}
      <div
        className={styles["backdrop"]}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close menu"
      />

      {/* Drawer Canvas */}
      <aside className={styles["drawer-panel"]}>
        {/* ================= HERO HEADER (Gojek / Grab Signature) ================= */}
        <div className={styles["drawer-hero"]}>
          {/* Top Bar: Logo & Close */}
          <div className={styles["hero-top-bar"]}>
            <div className={styles["hero-logo-box"]}>
              <Image
                src="/images/logo-white.svg"
                alt="SELOG Logo"
                width={88}
                height={24}
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <button
              type="button"
              className={styles["close-button"]}
              onClick={onClose}
              aria-label="Close drawer"
            >
              <CloseOutlined />
            </button>
          </div>

          {/* User Profile Card */}
          <div className={styles["user-profile-card"]}>
            <div className={styles["avatar-wrapper"]}>
              <Avatar
                src="/avatar.png"
                alt={user?.name || "User Avatar"}
                className={styles["user-avatar"]}
              />
              <span className={styles["status-pulse"]} title="Online" />
            </div>

            <div className={styles["user-info"]}>
              <span className={styles["greeting"]}>Hello, Welcome</span>
              <span className={styles["user-name"]}>
                {user?.name || "SELOG Operator"}
              </span>
              <span className={styles["role-badge"]}>
                <SafetyCertificateOutlined />
                {user?.roleName || "Warehouse Staff"}
              </span>
            </div>
          </div>

          {/* Context Card (Gojek Gopay / GrabPay Style) */}
          <div className={styles["context-card"]}>
            <div className={styles["context-row"]}>
              <div className={styles["context-icon-wrap"]}>
                <ShopOutlined />
              </div>
              <div className={styles["context-details"]}>
                <span className={styles["context-label"]}>Active Customer</span>
                <span className={styles["context-value"]}>
                  {selectedCustomerName || "All Customers"}
                </span>
              </div>
            </div>

            <div className={styles["context-divider"]} />

            <div className={styles["context-row"]}>
              <div
                className={`${styles["context-icon-wrap"]} ${styles["warehouse-icon"]}`}
              >
                <EnvironmentOutlined />
              </div>
              <div className={styles["context-details"]}>
                <span className={styles["context-label"]}>Warehouse / Hub</span>
                <span
                  className={`${styles["context-value"]} ${styles["highlight-warehouse"]}`}
                >
                  {selectedWarehouseName || "Primary Hub"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= REAL-TIME SEARCH BAR ================= */}
        <div className={styles["search-section"]}>
          <div className={styles["search-box"]}>
            <SearchOutlined className={styles["search-icon"]} />
            <input
              type="text"
              className={styles["search-input"]}
              placeholder="Search menu or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles["clear-btn"]}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <CloseCircleFilled />
              </button>
            )}
          </div>
        </div>

        {/* ================= SCROLLABLE NAVIGATION MENU ================= */}
        <div className={styles["drawer-body"]}>
          <div className={styles["menu-section-header"]}>
            <span className={styles["menu-section-title"]}>
              {searchQuery
                ? `Search Results (${filteredMenu.length})`
                : "Main Navigation"}
            </span>
            <span className={styles["menu-count-badge"]}>
              {filteredMenu.length}
            </span>
          </div>

          {filteredMenu.length > 0 ? (
            <Menu
              className={styles["mobile-antd-menu"]}
              mode="inline"
              theme="light"
              items={filteredMenu}
              selectedKeys={selectedKeys}
              openKeys={searchQuery ? autoOpenKeys : openKeys}
              onOpenChange={(keys) => {
                if (!searchQuery) setOpenKeys(keys as string[]);
              }}
              onClick={(e) => {
                onMenuChange(e);
                onClose();
              }}
            />
          ) : (
            <div className={styles["empty-search"]}>
              <SearchOutlined className={styles["empty-icon"]} />
              <span className={styles["empty-text"]}>
                No menu matches &quot;{searchQuery}&quot;
              </span>
            </div>
          )}

          {/* Logistics Feature Card (Gojek / Grab Super-App Style) */}
          <div className={styles["logistics-card"]}>
            <div className={styles["logistics-text"]}>
              <div className={styles["logistics-badge"]}>
                <span className={styles["badge-dot"]} />
                WMS 2.0
              </div>
              <span className={styles["logistics-title"]}>
                Faster scanning. Smarter tracking.
              </span>
              <span className={styles["logistics-sub"]}>
                One connected warehouse.
              </span>
            </div>
            <div className={styles["logistics-image-wrap"]}>
              <Image
                src="/images/wms-drawer-banner.jpg"
                alt="SELOG Warehouse Logistics"
                fill
                priority
                unoptimized
                sizes="132px"
                className={styles["banner-image"]}
              />
            </div>
          </div>
        </div>

        {/* ================= DRAWER FOOTER (COPYRIGHT) ================= */}
        <div className={styles["drawer-footer"]}>
          <span className={styles["copyright-text"]}>
            &copy;2026 - SELOG - PT Serasi Logistics Indonesia
          </span>
        </div>
      </aside>
    </div>
  );
};

export default MobileDrawer;
