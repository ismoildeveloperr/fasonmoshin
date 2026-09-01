import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { getAuthUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";
import { ProfileSidebar } from "@/widgets/ProfileSidebar";

import styles from "./ProfileLayout.module.scss";

type ProfileLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const ProfileLayout = ({
  title,
  description,
  children,
}: ProfileLayoutProps) => {
  const currentUser = getAuthUser();

  if (!currentUser) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.heading}>
          <span>Личный кабинет</span>

          <h1>{title}</h1>

          {description && <p>{description}</p>}
        </div>

        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <ProfileSidebar />
          </div>

          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </main>
  );
};
