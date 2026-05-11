import { StyleSheet, FlatList, Image, StatusBar, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';

const { width } = Dimensions.get('window');

const STORY_DATA = [
  { title: 'Bolsa Família', image: 'https://www.gov.br/pt-br/noticias/assistencia-social/2023/03/acrescimo-de-r-150-do-bolsa-familia-chega-a-mais-de-8-9-milhoes-de-criancas-em-marco/02032023_bolsa_familia_logo.png' },
  { title: 'Auxílio Gás', image: 'https://play-lh.googleusercontent.com/aMtgpakcj_06T9SIG3hxzx9nm7KarIVmwHNEu3xz0KsqTIGRhgl_bAr-NJNH--ZMmcI=w240-h480-rw' },
  { title: 'CNH Recife', image: 'https://storage.googleapis.com/gpt-engineer-file-uploads/2FqxXnr6lTTgqeTEvFGt5bTSTov2/social-images/social-1764954252437-generated-image%20(5).png' },
  { title: 'Prodarte', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMrgjm0ARucT5FVioNBcSUHWgqBmnhN65iFA&s' },
  { title: 'Mães de Pernambuco', image: 'https://s2-g1.glbimg.com/FAz4Q4lXaEyf2bo4sf18Bsml7vI=/0x0:2363x1463/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2024/T/t/rQn24zSPiXQg7MIAAsdA/maes-de-pernambuco.jpeg' },
];

const FEED_DATA = [
  {
    id: '1',
    author: 'Prefeitura de Garanhuns',
    authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2gncHgSme2yvN8Z7RsgI1XJ3Ts96iwi_5Vw&s',
    imageUrl: 'https://garanhuns.pe.gov.br/gid/wp-content/uploads/2024/04/WhatsApp-Image-2024-04-16-at-18.48.07.jpeg',
    description: 'Atenção, mães cadastradas! O pagamento da parcela deste mês já está disponível no aplicativo.',
  },
  {
    id: '2',
    author: 'Prefeitura do Recife',
    authorAvatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_52xcaCOKI3NRvflhP1D6-XehvoYhLv6y0w&s',
    imageUrl: 'https://imagens.ne10.uol.com.br/veiculos/_midias/jpg/2026/02/25/1224x674/1_divulgacao_pcr__2_-36488643.jpeg',
    description: 'Últimos dias para se inscrever no programa CNH Recife. Não perca a oportunidade de tirar sua habilitação gratuitamente.',
  },
];

export default function Home() {
  return (
    <View style={styles.container}>
      {/* --- HEADER SECTION --- */}

      <View style={styles.header}>
        <Image source={require('../../assets/images/splash-icon.png')}
        style={{ width: 45, height: 45 }} />
      </View>

      {/* --- STORY SECTION --- */}

      <View style={styles.storySection}>
        <FlatList 
          data={STORY_DATA}
          // keyExtractor={ (item) => item.arbitrary_number } // I might use this later to sort from the highest to lowest match
          renderItem={({ item }) => <StoryItem title={item.title} avatar_url={item.image} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyList}
        />
      </View>

      {/* --- FEED SECTION --- */}

      <View style={styles.feedContent}>
        <FlatList
          data={FEED_DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FeedItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedList}
        />
      </View>

    </View>
  );
}

const StoryItem = ( { title, avatar_url } : { title : string, avatar_url : string } ) => {
  return (
    <View style={styles.storyContainer}>
      {/* The colorful ring around the avatar */}
      <View style={[styles.avatarRing]}>
        <Image source={{ uri: avatar_url }} style={styles.avatar} />
      </View>
      {/* Truncate long names with numberOfLines */}
      <Text style={styles.username} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const FeedItem = ({ item }: { item: any }) => {
  return (
    <View style={styles.feedItemContainer}>
      {/* Post Header (Author Info) */}
      <View style={styles.feedItemHeader}>
        <Image source={{ uri: item.authorAvatar }} style={styles.feedItemAvatar} />
        <Text style={styles.feedItemAuthor}>{item.author}</Text>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.imageUrl }} style={styles.feedItemImage} />

      {/* Post Footer (Description) */}
      <View style={styles.feedItemFooter}>
        <Text style={styles.feedItemDescription}>
          <Text style={styles.feedItemAuthorBold}>{item.author} </Text>
          {item.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  header : {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
    paddingTop: 5,
  },
  storyList: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
    width: 72,
  },
  storySection: {
    paddingVertical: 0,
  },
  avatarRing: {
    width: 73,
    height: 73,
    borderRadius: 60,
    borderWidth: 2.5,
    borderColor: '#ff7a00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  username: {
    fontSize: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  feedContent: {
    flex: 1, // Ensures the FlatList takes up remaining vertical space
  },
  feedList: {
    paddingBottom: 20,
  },
  feedItemContainer: {
    marginBottom: 20,
  },
  feedItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  feedItemAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  feedItemAuthor: {
    fontWeight: '600',
    fontSize: 14,
  },
  feedItemImage: {
    width: width,
    height: width, // Keeps it a perfect square like Instagram
    backgroundColor: '#e1e4e8', // Skeleton color while loading
  },
  feedItemFooter: {
    padding: 10,
  },
  feedItemAuthorBold: {
    fontWeight: 'bold',
  },
  feedItemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});