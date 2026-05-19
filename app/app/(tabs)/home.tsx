import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, StatusBar, Dimensions, DeviceEventEmitter } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSQLiteContext } from 'expo-sqlite';

const { width } = Dimensions.get('window');

interface WelfareRow {
  benefit_id: number;
  name: string;
  sphere: number;
  provider: string;
  benefit_value: string;
  action_link: string;
  content: string;
  cover: string; 
  max_income_per_capita: number;
  max_income_family: number;
  min_age_user: number;
  max_child_age: number;
  needs_nis: number;
  needs_single_parent: number;
  needs_app_delivery_worker: number;
  needs_rural_worker: number;
  needs_public_school_student: number;
  needs_quilombola: number;
}

interface FeedItemRow {
  id: number;
  author: string;
  article: string;
  profile: string; 
  cover: string; 
}

interface UserRow {
  user_id: number;
  user_name: string;
  cpf: string;
  birthdate: number;
  nis: string | null;
  cep: string | null;
  house_income: number;
  house_count_total: number;
  house_count_kids: number;
  has_quilombola: number;
  has_single_parent: number;
  has_app_delivery_worker: number;
  has_rural_worker: number;
  has_public_school_student: number;
}

export default function Home() {
  const db = useSQLiteContext();
  const [feedData, setFeedData] = useState<FeedItemRow[]>([]);
  const [welfareData, setWelfareData] = useState<WelfareRow[]>([]);
  const [currentUser, setCurrentUser] = useState<UserRow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Decoupled query pipeline so it can be called seamlessly during updates
  async function fetchData() {
    try {
      const feedResult = await db.getAllAsync<FeedItemRow>(
        'SELECT * FROM feed ORDER BY id DESC'
      );
      setFeedData(feedResult);

      const welfareResult = await db.getAllAsync<WelfareRow>(
        'SELECT * FROM welfare ORDER BY benefit_id ASC'
      );
      setWelfareData(welfareResult);

      const userResult = await db.getAllAsync<UserRow>(
        'SELECT * FROM users WHERE user_id = 1'
      );
      if (userResult.length > 0) {
        setCurrentUser(userResult[0]);
      }
    } catch (error) {
      console.error("Failed to read from SQLite database:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Initial fetch on component mount
    fetchData();

    // --- SETUP DEVICE EVENT EMITTER LISTENER ---
    const subscription = DeviceEventEmitter.addListener('welfare:profile_updated', () => {
      fetchData();
    });

    // Clean up subscription to prevent leaks when navigating out
    return () => {
      subscription.remove();
    };
  }, [db]);

  const checkEligibility = (benefit: WelfareRow, user: UserRow | null): boolean => {
    if (!user) return false;

    // 1. Per Capita Income restriction check
    const userPerCapitaIncome = user.house_income / (user.house_count_total || 1);
    if (userPerCapitaIncome > benefit.max_income_per_capita) return false;

    // 2. Global Family Income restriction check
    if (user.house_income > benefit.max_income_family) return false;

    // 3. Flags and requirements check
    if (benefit.needs_nis === 1 && !user.nis) return false;
    if (benefit.needs_single_parent === 1 && user.has_single_parent === 0) return false;
    if (benefit.needs_app_delivery_worker === 1 && user.has_app_delivery_worker === 0) return false;
    if (benefit.needs_rural_worker === 1 && user.has_rural_worker === 0) return false;
    if (benefit.needs_public_school_student === 1 && user.has_public_school_student === 0) return false;
    if (benefit.needs_quilombola === 1 && user.has_quilombola === 0) return false;

    return true;
  };

  return (
    <View style={styles.container}>

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/splash-icon.png')} style={{ width: 45, height: 45 }} />
      </View>

      {/* --- STORIES SECTION --- */}
      <View style={styles.storySection}>
        {isLoading ? (
          <View style={{ height: 90, justifyContent: 'center', paddingLeft: 20 }}><Text>...</Text></View>
        ) : (
          <FlatList 
            data={welfareData}
            keyExtractor={(item) => item.benefit_id.toString()}
            renderItem={({ item }) => {
              const isEligible = checkEligibility(item, currentUser);
              return (
                <StoryItem 
                  title={item.name} 
                  avatar_base64={item.cover} 
                  isEligible={isEligible} 
                />
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storyList}
          />
        )}
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <FeedItem item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.feedList}
          />
        )}
      </View>

    </View>
  );
}

const StoryItem = ({ title, avatar_base64, isEligible }: { title: string, avatar_base64: string, isEligible: boolean }) => {
  return (
    <View style={styles.storyContainer}>
      <View style={[styles.avatarRing, { borderColor: isEligible ? '#2e7d32' : '#ff7a00' }]}>
        <Image 
          source={avatar_base64 ? { uri: avatar_base64 } : require('../../assets/images/splash-icon.png')} 
          style={styles.avatar} 
        />
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const FeedItem = ({ item }: { item: FeedItemRow }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const minimum_lines = 3;

  return (
    <View style={styles.feedItemContainer}>
      <View style={styles.feedItemHeader}>
        <Image source={{ uri: item.profile || undefined }} style={[styles.feedItemAvatar, !item.profile && { backgroundColor: '#e1e4e8' }]} />
        <Text style={styles.feedItemAuthor}>{item.author}</Text>
      </View>
      <Image source={{ uri: item.cover || undefined }} style={styles.feedItemImage} />

      <View style={styles.feedItemFooter}>
        <Text 
          style={styles.feedItemDescription}
          numberOfLines={(showReadMore && !isExpanded) ? minimum_lines : undefined}
          onTextLayout={(e) => {
            if (!showReadMore && e.nativeEvent.lines.length > minimum_lines) {
              setShowReadMore(true);
            }
          }}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e1e4e8',
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