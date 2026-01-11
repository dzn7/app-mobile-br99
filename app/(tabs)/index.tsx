/**
 * Tela Inicial - BarbeariaBR99
 * Home do aplicativo com hero, serviços e avaliações
 */

import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useTema } from "@/contexts/TemaContext";
import Cores from "@/constants/Colors";
import { Texto, Botao, Cartao, Carregando, IconeEstrela } from "@/components/ui";
import { useServicos } from "@/hooks/useServicos";
import { useAvaliacoes } from "@/hooks/useAvaliacoes";
import { formatarPreco } from "@/lib/horarios";

const { width } = Dimensions.get("window");

/**
 * Seção Hero
 */
function SecaoHero() {
  const { tema } = useTema();
  const cores = Cores[tema];
  const { estatisticas } = useAvaliacoes();

  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      style={[styles.hero, { backgroundColor: cores.fundo }]}
    >
      {/* Badge de avaliação */}
      <View
        style={[
          styles.badgeAvaliacao,
          { backgroundColor: cores.destaque },
        ]}
      >
        <IconeEstrela tamanho={14} cor={Cores.fixas.estrela} />
        <Texto variante="pequeno" negrito>
          {estatisticas.mediaNotas} estrelas • {estatisticas.totalAvaliacoes}{" "}
          avaliações
        </Texto>
      </View>

      {/* Título */}
      <Texto variante="titulo" style={styles.titulo}>
        Estilo que{"\n"}
        <Texto variante="titulo" secundario>
          Surpreende
        </Texto>
      </Texto>

      {/* Descrição */}
      <Texto variante="corpo" secundario style={styles.descricao}>
        Mais de 4 anos transformando estilos em Barras, PI. Agende seu horário e
        venha viver essa experiência BR99.
      </Texto>

      {/* Botões de ação */}
      <View style={styles.botoesAcao}>
        <Botao
          titulo="Agendar Horário"
          onPress={() => router.push("/(tabs)/agendamento")}
          larguraTotal
          iconeEsquerda={
            <Animated.View entering={FadeInRight.delay(300)}>
              <IconeEstrela tamanho={18} cor={cores.botaoPrimarioTexto} />
            </Animated.View>
          }
        />

        <Botao
          titulo="(86) 99415-6652"
          onPress={() => Linking.openURL("tel:+558694156652")}
          variante="outline"
          larguraTotal
        />
      </View>

      {/* Estatísticas */}
      <View style={styles.estatisticas}>
        <View style={styles.estatistica}>
          <Texto variante="titulo" negrito>
            4+
          </Texto>
          <Texto variante="pequeno" secundario>
            Anos
          </Texto>
        </View>
        <View style={[styles.divisor, { backgroundColor: cores.borda }]} />
        <View style={styles.estatistica}>
          <Texto variante="titulo" negrito>
            {estatisticas.totalAvaliacoes}
          </Texto>
          <Texto variante="pequeno" secundario>
            Avaliações
          </Texto>
        </View>
        <View style={[styles.divisor, { backgroundColor: cores.borda }]} />
        <View style={styles.estatistica}>
          <Texto variante="titulo" negrito>
            {estatisticas.porcentagem5Estrelas}%
          </Texto>
          <Texto variante="pequeno" secundario>
            5 Estrelas
          </Texto>
        </View>
      </View>
    </Animated.View>
  );
}

/**
 * Seção de Serviços
 */
function SecaoServicos() {
  const { tema } = useTema();
  const cores = Cores[tema];
  const { servicos, carregando } = useServicos();

  const servicosDestaque = servicos.slice(0, 3);

  if (carregando) {
    return (
      <View style={styles.secao}>
        <Carregando mensagem="Carregando serviços..." />
      </View>
    );
  }

  return (
    <View style={styles.secao}>
      <Texto variante="subtitulo" centralizado style={styles.tituloSecao}>
        Nossos Serviços
      </Texto>
      <Texto variante="corpo" secundario centralizado style={styles.subtituloSecao}>
        Serviços em destaque
      </Texto>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaServicos}
      >
        {servicosDestaque.map((servico, index) => (
          <Animated.View
            key={servico.id}
            entering={FadeInRight.delay(index * 100).springify()}
          >
            <Cartao estilo={styles.cartaoServico}>
              <View style={styles.servicoHeader}>
                <View
                  style={[
                    styles.iconeServico,
                    { backgroundColor: cores.destaque },
                  ]}
                >
                  <Texto variante="subtitulo">✂️</Texto>
                </View>
                <View style={styles.servicoPreco}>
                  <Texto variante="subtitulo" negrito>
                    {formatarPreco(servico.preco)}
                  </Texto>
                  <Texto variante="pequeno" secundario>
                    {servico.duracao}min
                  </Texto>
                </View>
              </View>

              <Texto variante="label" negrito numberOfLines={2}>
                {servico.nome}
              </Texto>

              <Botao
                titulo="Agendar"
                onPress={() => router.push("/(tabs)/agendamento")}
                tamanho="pequeno"
                larguraTotal
                estilo={{ marginTop: 12 }}
              />
            </Cartao>
          </Animated.View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => {}}
        style={styles.verTodos}
      >
        <Texto variante="label" cor={cores.texto}>
          Ver todos os serviços →
        </Texto>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Seção de Avaliações
 */
function SecaoAvaliacoes() {
  const { tema } = useTema();
  const cores = Cores[tema];
  const { avaliacoes, estatisticas, carregando } = useAvaliacoes();

  if (carregando) {
    return (
      <View style={styles.secao}>
        <Carregando mensagem="Carregando avaliações..." />
      </View>
    );
  }

  const ultimasAvaliacoes = avaliacoes.slice(0, 3);

  return (
    <View style={[styles.secao, { backgroundColor: cores.fundoSecundario }]}>
      <Texto variante="subtitulo" centralizado style={styles.tituloSecao}>
        O Que Nossos Clientes Dizem
      </Texto>

      {/* Média geral */}
      <View style={[styles.mediaGeral, { backgroundColor: cores.cartao }]}>
        <Texto variante="titulo" style={{ fontSize: 48 }}>
          {estatisticas.mediaNotas}
        </Texto>
        <View style={styles.estrelasMedia}>
          {[1, 2, 3, 4, 5].map((i) => (
            <IconeEstrela
              key={i}
              tamanho={20}
              cor={
                i <= Math.round(parseFloat(estatisticas.mediaNotas))
                  ? Cores.fixas.estrela
                  : cores.borda
              }
            />
          ))}
        </View>
        <Texto variante="pequeno" secundario>
          Baseado em {estatisticas.totalAvaliacoes} avaliações
        </Texto>
      </View>

      {/* Lista de avaliações */}
      {ultimasAvaliacoes.map((avaliacao, index) => (
        <Animated.View
          key={avaliacao.id}
          entering={FadeInDown.delay(index * 100).springify()}
        >
          <Cartao estilo={styles.cartaoAvaliacao}>
            <View style={styles.avaliacaoHeader}>
              <Texto variante="label" negrito>
                {avaliacao.nome}
              </Texto>
              <View style={styles.estrelasAvaliacao}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconeEstrela
                    key={i}
                    tamanho={14}
                    cor={
                      i <= avaliacao.avaliacao
                        ? Cores.fixas.estrela
                        : cores.borda
                    }
                  />
                ))}
              </View>
            </View>
            <Texto variante="corpo" secundario numberOfLines={3}>
              "{avaliacao.comentario}"
            </Texto>
          </Cartao>
        </Animated.View>
      ))}

      <Botao
        titulo="Ver Todas Avaliações"
        onPress={() => {}}
        variante="outline"
        estilo={{ marginTop: 16 }}
      />
    </View>
  );
}

/**
 * Seção de Localização
 */
function SecaoLocalizacao() {
  const { tema } = useTema();
  const cores = Cores[tema];

  return (
    <View
      style={[
        styles.secaoLocalizacao,
        { backgroundColor: tema === "dark" ? "#18181b" : "#09090b" },
      ]}
    >
      <Texto
        variante="subtitulo"
        centralizado
        cor="#ffffff"
        style={styles.tituloSecao}
      >
        Venha nos visitar
      </Texto>

      <View style={styles.infoLocalizacao}>
        <Texto variante="corpo" cor="#d4d4d8" centralizado>
          📍 Rua Duque de Caxias, 601 - Xique-Xique, Barras - PI
        </Texto>
        <Texto variante="corpo" cor="#d4d4d8" centralizado style={{ marginTop: 8 }}>
          📞 (86) 99415-6652
        </Texto>
      </View>

      <Botao
        titulo="Agendar Agora"
        onPress={() => router.push("/(tabs)/agendamento")}
        estilo={{
          marginTop: 24,
          backgroundColor: "#ffffff",
        }}
        estiloTexto={{ color: "#09090b" }}
      />
    </View>
  );
}

/**
 * Tela Inicial
 */
export default function TelaInicial() {
  const { tema } = useTema();
  const cores = Cores[tema];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: cores.fundo }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={
              tema === "dark"
                ? require("@/assets/images/logo/logodark.webp")
                : require("@/assets/images/logo/logowhite.webp")
            }
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        <SecaoHero />
        <SecaoServicos />
        <SecaoAvaliacoes />
        <SecaoLocalizacao />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  logo: {
    width: 180,
    height: 60,
  },
  hero: {
    padding: 20,
  },
  badgeAvaliacao: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  titulo: {
    marginBottom: 12,
  },
  descricao: {
    marginBottom: 24,
    maxWidth: 300,
  },
  botoesAcao: {
    gap: 12,
    marginBottom: 32,
  },
  estatisticas: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 24,
  },
  estatistica: {
    alignItems: "center",
  },
  divisor: {
    width: 1,
    height: 40,
  },
  secao: {
    padding: 20,
  },
  tituloSecao: {
    marginBottom: 8,
  },
  subtituloSecao: {
    marginBottom: 20,
  },
  listaServicos: {
    paddingVertical: 8,
    gap: 12,
  },
  cartaoServico: {
    width: width * 0.7,
    marginRight: 12,
  },
  servicoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconeServico: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  servicoPreco: {
    alignItems: "flex-end",
  },
  verTodos: {
    alignItems: "center",
    paddingTop: 16,
  },
  mediaGeral: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  estrelasMedia: {
    flexDirection: "row",
    gap: 4,
    marginVertical: 8,
  },
  cartaoAvaliacao: {
    marginBottom: 12,
  },
  avaliacaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  estrelasAvaliacao: {
    flexDirection: "row",
    gap: 2,
  },
  secaoLocalizacao: {
    padding: 40,
    alignItems: "center",
  },
  infoLocalizacao: {
    marginTop: 16,
  },
});
