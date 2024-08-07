import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.wrapper';
import NProgressWrapper from '@/lib/next.nprogress';
import { TrackContextProvider } from '@/lib/track.wrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NProgressWrapper>
            <NextAuthWrapper>
              <TrackContextProvider>
                {children}
              </TrackContextProvider>
            </NextAuthWrapper>
          </NProgressWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
