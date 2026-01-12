/**
 * Tela de Perfil - BarbeariaBR99
 * Configurações e informações do usuário
 */

import {
    Cartao,
    IconeLocal,
    IconeTelefone,
    Texto
} from "@/components/ui";
import Cores from "@/constants/Colors";
import { useTema } from "@/contexts/TemaContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Item de configuração
 */
function ItemConfiguracao({
  icone,
  titulo,
  subtitulo,
  onPress,
  tipo = "link",
  valor,
  onToggle,
}: {
  icone: React.ReactNode;
  titulo: string;
  subtitulo?: string;
  onPress?: () => void;
  tipo?: "link" | "switch";
  valor?: boolean;
  onToggle?: (valor: boolean) => void;
}) {
  const { tema } = useTema();
  const cores = Cores[tema];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={tipo === "switch"}
      activeOpacity={0.7}
      style={[styles.itemConfig, { borderBottomColor: cores.borda }]}
    >
      <View style={styles.itemIcone}>{icone}</View>
      <View style={styles.itemTexto}>
        <Texto variante="corpo">{titulo}</Texto>
        {subtitulo && (
          <Texto variante="pequeno" secundario>
            {subtitulo}
          </Texto>
        )}
      </View>
      {tipo === "link" && (
        <Ionicons name="chevron-forward" size={20} color={cores.textoSecundario} />
      )}
      {tipo === "switch" && (
        <Switch
          value={valor}
          onValueChange={(novoValor) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggle?.(novoValor);
          }}
          trackColor={{ false: cores.borda, true: cores.sucesso }}
          thumbColor="#ffffff"
        />
      )}
    </TouchableOpacity>
  );
}

/**
 * Tela de Perfil
 */
export default function TelaPerfil() {
  const { tema, alternarTema, definirTema, temaConfigurado } = useTema();
  const cores = Cores[tema];

  const abrirWhatsApp = () => {
    const mensagem = encodeURIComponent(
      "Olá! Gostaria de mais informações sobre a Barbearia BR99."
    );
    Linking.openURL(`https://wa.me/5586994156652?text=${mensagem}`);
  };

  const abrirTelefone = () => {
    Linking.openURL("tel:+5586994156652");
  };

  const abrirMapa = () => {
    const endereco = encodeURIComponent(
      "Rua Duque de Caxias, 601 - Xique-Xique, Barras - PI"
    );
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${endereco}`);
  };

  const abrirInstagram = () => {
    Linking.openURL("https://instagram.com/barbeariabr99");
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: cores.fundo }]}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header com logo */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.headerPerfil}
        >
          <Image
            source={
              tema === "dark"
                ? require("@/assets/images/logo/logodark.webp")
                : require("@/assets/images/logo/logowhite.webp")
            }
            style={styles.logo}
            contentFit="contain"
          />
          <Texto variante="titulo" style={styles.titulo}>
            Barbearia BR99
          </Texto>
          <Texto variante="corpo" secundario>
            Estilo que Surpreende
          </Texto>
        </Animated.View>

        {/* Informações de contato */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <Texto variante="label" negrito style={styles.secaoTitulo}>
            Contato
          </Texto>

          <Cartao>
            <ItemConfiguracao
              icone={<IconeTelefone tamanho={20} cor={cores.texto} />}
              titulo="(86) 99415-6652"
              subtitulo="Toque para ligar"
              onPress={abrirTelefone}
            />
            <ItemConfiguracao
              icone={
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              }
              titulo="WhatsApp"
              subtitulo="Enviar mensagem"
              onPress={abrirWhatsApp}
            />
            <ItemConfiguracao
              icone={
                <Ionicons name="logo-instagram" size={20} color="#E1306C" />
              }
              titulo="@barbeariabr99"
              subtitulo="Siga no Instagram"
              onPress={abrirInstagram}
            />
            <ItemConfiguracao
              icone={<IconeLocal tamanho={20} cor={cores.texto} />}
              titulo="Localização"
              subtitulo="Rua Duque de Caxias, 601 - Barras, PI"
              onPress={abrirMapa}
            />
          </Cartao>
        </Animated.View>

        {/* Horário de funcionamento */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <Texto variante="label" negrito style={styles.secaoTitulo}>
            Horário de Funcionamento
          </Texto>

          <Cartao>
            <View style={styles.horarioItem}>
              <Texto variante="corpo">Segunda a Sexta</Texto>
              <Texto variante="corpo" negrito>
                09:00 - 19:00
              </Texto>
            </View>
            <View style={[styles.horarioItem, { borderBottomWidth: 0 }]}>
              <Texto variante="corpo">Sábado</Texto>
              <Texto variante="corpo" negrito>
                09:00 - 17:00
              </Texto>
            </View>
          </Cartao>
        </Animated.View>

        {/* Configurações */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <Texto variante="label" negrito style={styles.secaoTitulo}>
            Configurações
          </Texto>

          <Cartao>
            <ItemConfiguracao
              icone={
                <Ionicons
                  name={tema === "dark" ? "moon" : "sunny"}
                  size={20}
                  color={cores.texto}
                />
              }
              titulo="Modo Escuro"
              subtitulo={tema === "dark" ? "Ativado" : "Desativado"}
              tipo="switch"
              valor={tema === "dark"}
              onToggle={alternarTema}
            />
          </Cartao>
        </Animated.View>

        {/* Sobre */}
        <Animated.View entering={FadeInDown.delay(500)}>
          <Texto variante="label" negrito style={styles.secaoTitulo}>
            Sobre
          </Texto>

          <Cartao>
            <ItemConfiguracao
              icone={<Feather name="info" size={20} color={cores.texto} />}
              titulo="Versão do App"
              subtitulo="1.0.0"
            />
            <ItemConfiguracao
              icone={<Feather name="shield" size={20} color={cores.texto} />}
              titulo="Política de Privacidade"
              onPress={() =>
                Alert.alert(
                  "Política de Privacidade",
                  "Seus dados são tratados com segurança e não são compartilhados com terceiros."
                )
              }
            />
          </Cartao>
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInDown.delay(500)}
          style={styles.footer}
        >
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://www.instagram.com/derick.mackenzie/')}
            activeOpacity={0.7}
          >
            <Texto variante="pequeno" secundario centralizado>
              Desenvolvido por{' '}
              <Texto variante="pequeno" cor={Cores.fixas.info} negrito>
                Derick Mackenzie
              </Texto>
            </Texto>
          </TouchableOpacity>
          <Texto variante="pequeno" secundario centralizado>
            2026 Barbearia BR99 - Todos os direitos reservados
          </Texto>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerPerfil: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  titulo: {
    marginBottom: 4,
  },
  secaoTitulo: {
    marginTop: 24,
    marginBottom: 12,
    paddingLeft: 4,
  },
  itemConfig: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  itemIcone: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f4f4f520",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemTexto: {
    flex: 1,
  },
  horarioItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a30",
  },
  footer: {
    marginTop: 40,
    gap: 4,
  },
});
