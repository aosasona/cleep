import axios from "axios";
import { API_URL } from "../constants/url";
import Cookies from "js-cookie";

const SESSION_ID_IDENTIFIER = "cleep-session-key";
const SIGNING_KEY_IDENTIFIER = "cleep-signing-key";

export const getSessionData = (): { sessionID: string; signingKey: string } => {
	const sessionID = Cookies.get(SESSION_ID_IDENTIFIER) || "";
	const signingKey = sessionStorage.getItem(SIGNING_KEY_IDENTIFIER) || "";
	return { sessionID, signingKey };
};

export const hasExistingSession = () => {
	const sessionID = Cookies.get(SESSION_ID_IDENTIFIER);
	if (!sessionID) return false;
	return true;
};

export const hasExistingSigningKey = () => {
	const signingKey = sessionStorage.getItem(SIGNING_KEY_IDENTIFIER);
	if (!signingKey) return false;
	return true;
};

export const saveSigningKey = (signingKey: string) => {
	sessionStorage.setItem(SIGNING_KEY_IDENTIFIER, signingKey);
};

export const createSession = async (signingKey: string) => {
	try {
		if (hasExistingSession()) {
			return;
		}
		const { data: createdSession } = await axios.post(`${API_URL}/session/create`, { signing_key: signingKey });

		Cookies.set(SESSION_ID_IDENTIFIER, createdSession.data.session_id, { expires: 1 });
		sessionStorage.setItem(SIGNING_KEY_IDENTIFIER, signingKey);

		return createdSession;
	} catch (error) {
		throw error;
	}
};

export const fetchSessionDocuments = async (sessionID: string, signingKey: string) => {
	try {
		const { data: sessionData } = await axios.get(`${API_URL}/documents`, {
			headers: {
				"x-session-id": sessionID,
				"x-signing-key": signingKey,
			},
		});
		return sessionData;
	} catch (error) {
		throw error;
	}
};

export const destroySession = () => {
	Cookies.remove(SESSION_ID_IDENTIFIER);
	sessionStorage.removeItem(SIGNING_KEY_IDENTIFIER);
};
