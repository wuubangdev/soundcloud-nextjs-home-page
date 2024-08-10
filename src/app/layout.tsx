import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.wrapper';
import NProgressWrapper from '@/lib/next.nprogress';
import { ToastContextProvider } from '@/lib/toast.info.wrapper';
import { TrackContextProvider } from '@/lib/track.wrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NProgressWrapper>
            <ToastContextProvider>
              <NextAuthWrapper>
                <TrackContextProvider>
                  {children}
                </TrackContextProvider>
              </NextAuthWrapper>
            </ToastContextProvider>
          </NProgressWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
