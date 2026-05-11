import { StyleSheet, FlatList, Image, StatusBar } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
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
          keyExtractor={ (item) => item.id }
          renderItem={({ item }) => <StoryItem title={item.username} avatar_url={item.avatar} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyList}
        />
      </View>

      {/* --- FEED SECTION --- */}

      <View style={styles.feedContent}>
        <Text style={styles.title}>oiii</Text>
      </View>

    </View>
  );
}

const STORY_DATA = [
  { id: '1', username: 'Your Story', avatar: 'https://i.pravatar.cc/150?img=1', isUser: true },
  { id: '2', username: 'john_doe', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '3', username: 'jane_smith', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '4', username: 'alex_dev', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '5', username: 'react_guru', avatar: 'https://i.pravatar.cc/150?img=12' },
];

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  header : {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
    paddingTop: 5,
  },
  storySection: {
    paddingVertical: 0,
  },
  storyList: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
    width: 72,
  },
  avatarRing: {
    width: 73,
    height: 73,
    borderRadius: 60,
    borderWidth: 2.5,
    borderColor: '#E1306C', // Instagram-style pink border
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});