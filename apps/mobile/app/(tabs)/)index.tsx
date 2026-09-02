import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { todayLocalISODate } from '@devocional/domain/date';
import { useDailyDevotional, useMonthlyAndWeeklyVerse } from '@devocional/domain/hooks';
import { styles } from '@/src/lib/styles';
import { useState, useEffect } from 'react';

export default function DevocionalScreen() {
  const date = todayLocalISODate();
  const { data: settings } = useMonthlyAndWeeklyVerse();
  const { data: devotional, isLoading, isEmpty } = useDailyDevotional(date);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {settings && (
          <View style={styles.versesContainer}>
            <View style={styles.monthlyVerseCard}>
              <Text style={styles.verseLabel}>Versículo do Mês</Text>
              <Text style={styles.verseText}>{settings.monthlyVerse}</Text>
            </View>
            <View style={styles.weeklyVerseCard}>
              <Text style={styles.verseLabel}>Versículo da Semana</Text>
              <Text style={styles.verseText}>{settings.weeklyVerse}</Text>
            </View>
          </View>
        )}

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>

        {isEmpty ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              O devocional de hoje ainda não foi publicado.
            </Text>
          </View>
        ) : devotional && (
          <>
            <View style={styles.scriptureCard}>
              <Text style={styles.scriptureText}>{devotional.scripture}</Text>
            </View>

            <View style={styles.reflectionCard}>
              <Text style={styles.reflectionText}>{devotional.reflection}</Text>
            </View>

            {devotional.audioUrl && (
              <AudioPlayerComponent audioUrl={devotional.audioUrl} />
            )}

            <View style={styles.prayerCard}>
              <Text style={styles.prayerLabel}>Sugestão de Oração</Text>
              <Text style={styles.prayerText}>{devotional.prayerSuggestion}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AudioPlayerComponent({ audioUrl }: { audioUrl: string }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadSound = async () => {
    if (sound) return;
    setIsLoading(true);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false, isLooping: false },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (!sound) {
      await loadSound();
      await sound?.playAsync();
      setIsPlaying(true);
    } else if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  if (isLoading) {
    return (
      <View style={styles.audioCard}>
        <View style={styles.audioControls}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={styles.audioLabel}>Carregando áudio...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.audioCard}>
      <View style={styles.audioControls}>
        <TouchableOpacity
          style={[
            styles.playButton,
            isPlaying && styles.playButtonPlaying,
          ]}
          onPress={togglePlay}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.audioLabel}>
          Ouvir devocional
        </Text>
      </View>
    </View>
  );
}