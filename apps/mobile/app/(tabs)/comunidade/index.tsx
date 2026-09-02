import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useCommunity, useCommunityMessages, useSendCommunityMessage } from '@devocional/domain/hooks';
import { styles } from '@/src/lib/styles';
import { useState } from 'react';

export default function ComunidadeScreen() {
  const [communityId, setCommunityId] = useState<string>('');
  const { data: community } = useCommunity(communityId);
  const { data: messages, isLoading } = useCommunityMessages(communityId);
  const sendMessage = useSendCommunityMessage();

  const [newMessage, setNewMessage] = useState('');

  const handleSend = async () => {
    if (!newMessage.trim() || !communityId) return;
    await sendMessage.mutateAsync({ communityId, content: newMessage });
    setNewMessage('');
  };

  if (!communityId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.joinContainer}>
          <Text style={styles.joinTitle}>Entrar na Comunidade</Text>
          <TextInput
            style={styles.joinInput}
            placeholder="Código de convite (8 caracteres)"
            maxLength={8}
            onChangeText={setCommunityId}
            value={communityId}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.joinButton} onPress={() => {}}>
            <Text style={styles.joinButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        {community && (
          <View style={styles.scriptureCard}>
            <Text style={styles.scriptureLabel}>Escritura da Comunidade</Text>
            <Text style={styles.scriptureText}>{community.scripture || 'Nenhuma escritura definida'}</Text>
          </View>
        )}

        <View style={styles.messagesSection}>
          <Text style={styles.sectionTitle}>Mural do AG</Text>
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <View key={msg._id} style={styles.messageCard}>
                <Text style={styles.messageText}>{msg.content}</Text>
                <Text style={styles.messageTime}>
                  {new Date(msg.sentAt).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessages}>Nenhuma mensagem no mural</Text>
          )}
        </View>

        {community && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.composerContainer}
            keyboardVerticalOffset={0}
          >
            <View style={styles.composerInner}>
              <TextInput
                style={styles.composerInput}
                placeholder="Escreva uma mensagem para a comunidade (apenas AG)"
                multiline
                numberOfLines={4}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholderTextColor="#a3a3a3"
              />
              <TouchableOpacity
                style={styles.composerButton}
                onPress={handleSend}
                disabled={!newMessage.trim() || sendMessage.isPending}
              >
                <Text style={styles.composerButtonText}>
                  {sendMessage.isPending ? 'Enviando...' : 'Enviar'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}