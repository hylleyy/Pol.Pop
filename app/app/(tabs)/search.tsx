import { StyleSheet, TextInput, Image, useColorScheme, StatusBar } from 'react-native';
import { View } from '@/components/Themed';

export default function Discovery() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View style={styles.container}>
      {/* --- SEARCH BAR SECTION --- */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image 
            source={require('../../assets/images/icons/search.png')} 
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              tintColor: colorScheme === 'light' ? '#000000' : undefined,
            }} 
          />
          <TextInput
            placeholder="Pesquisar benefícios…"
            placeholderTextColor={colorScheme === 'light' ? '#666' : '#999'}
            style={[
              styles.input, 
              { color: colorScheme === 'light' ? '#000' : '#fff' }
            ]}
          />
        </View>
      </View>

      {/* --- REST OF SCREEN (EMPTY) --- */}
      <View style={styles.content} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  content: {
    flex: 1,
    // This space is intentionally left empty for future implementation
  },
});