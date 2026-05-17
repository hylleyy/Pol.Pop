import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, StatusBar, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSQLiteContext } from 'expo-sqlite';

const { width } = Dimensions.get('window');

const STORY_DATA = [
  { title: 'Bolsa Família', image: 'https://www.gov.br/pt-br/noticias/assistencia-social/2023/03/acrescimo-de-r-150-do-bolsa-familia-chega-a-mais-de-8-9-milhoes-de-criancas-em-marco/02032023_bolsa_familia_logo.png' },
  { title: 'Auxílio Gás', image: 'https://play-lh.googleusercontent.com/aMtgpakcj_06T9SIG3hxzx9nm7KarIVmwHNEu3xz0KsqTIGRhgl_bAr-NJNH--ZMmcI=w240-h480-rw' },
  { title: 'CNH Recife', image: 'https://storage.googleapis.com/gpt-engineer-file-uploads/2FqxXnr6lTTgqeTEvFGt5bTSTov2/social-images/social-1764954252437-generated-image%20(5).png' },
  { title: 'Prodarte', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMrgjm0ARucT5FVioNBcSUHWgqBmnhN65iFA&s' },
  { title: 'Mães de Pernambuco', image: 'https://s2-g1.glbimg.com/FAz4Q4lXaEyf2bo4sf18Bsml7vI=/0x0:2363x1463/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2024/T/t/rQn24zSPiXQg7MIAAsdA/maes-de-pernambuco.jpeg' },
];

interface FeedItemRow {
  id: number;
  author: string;
  article: string;
  profile: string; // base64 string
  cover: string; // base64 string
}

export default function Home() {
  const db = useSQLiteContext();
  const [feedData, setFeedData] = useState<FeedItemRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const result = await db.getAllAsync<FeedItemRow>(
          'SELECT * FROM feed ORDER BY id DESC'
        );
        setFeedData(result);
      } catch (error) {
        console.error("Failed to read from SQLite feed table:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeed();
  }, [db]);

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
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Carregando feed...</Text>
          </View>
        ) : (
          <FlatList
            data={feedData}
            keyExtractor={(item) => item.id.toString()} // explicit safe key sorting
            renderItem={({ item }) => <FeedItem item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.feedList}
          />
        )}
      </View>

    </View>
  );
}

const StoryItem = ( { title, avatar_url } : { title : string, avatar_url : string } ) => {
  return (
    <View style={styles.storyContainer}>

      {/* --- RING --- */}

      <View style={[styles.avatarRing]}>
        <Image source={{ uri: avatar_url }} style={styles.avatar} />
      </View>

      {/* --- NAME --- */}

      <Text style={styles.username} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const FeedItem = ({ item }: { item: FeedItemRow }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const minimum_lines = 4

  return (
    <View style={styles.feedItemContainer}>

      {/* --- AUTHOR INFO --- */}

      <View style={styles.feedItemHeader}>
        <Image source={{ uri: item.profile || undefined }} style={[styles.feedItemAvatar, !item.profile && { backgroundColor: '#e1e4e8' }]} />
        <Text style={styles.feedItemAuthor}>{item.author}</Text>
      </View>

      {/* --- COVER --- */}

      <Image source={{ uri: item.cover || undefined }} style={styles.feedItemImage} />

      {/* --- ARTICLE --- */}

      <View style={styles.feedItemFooter}>
        <Text 
          style={styles.feedItemDescription}
          numberOfLines={isExpanded ? undefined : minimum_lines}
          onTextLayout={(e) => !showReadMore && setShowReadMore(e.nativeEvent.lines.length > minimum_lines)}
        >
          <Text style={styles.feedItemAuthorBold}>{item.author} </Text>
          {item.article}
        </Text>
        
        {showReadMore && (
          <Text style={styles.readMoreText} onPress={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Ler menos' : 'Ler mais'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  header: {
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
  feedContent: {
    flex: 1,
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
    height: width,
    backgroundColor: '#e1e4e8',
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
  readMoreText: {
    color: '#888888',
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});