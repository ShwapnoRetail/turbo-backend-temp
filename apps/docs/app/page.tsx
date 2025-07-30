// import Image, { type ImageProps } from "next/image";
// import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { prisma } from "@repo/db";


export default async function Home() {
  const user = await prisma.user.findFirst()
  return (
    <div className={styles.page}>
        {
          user ? (
            <h1>Welcome, {user.name}!</h1>
          ) : (
            <h1>Welcome to the App!</h1>
          )
        }
    </div>
  );
}
