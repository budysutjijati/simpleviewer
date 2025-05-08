import App from './App';

export const run = (context) => {
	context.setLayout('application');
	context.setContent(<App />);
};
