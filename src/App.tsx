import './index.css';
import './app.css';
import { StoriesProvider } from './context/StoriesProvider';
import StoryUI from './components/StoryUI';

function App() {
	return (
		<StoriesProvider>
			<StoryUI />
		</StoriesProvider>
	);
}

export default App;
