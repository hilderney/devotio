import { Stack } from 'expo-router';
import { Providers } from '@/src/lib/providers';
import { useColorScheme } from 'react-native';
import { GlobalStyles } from '@/src/lib/globalStyles';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Providers>
      <GlobalStyles colorScheme={colorScheme} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Providers>
  );
}