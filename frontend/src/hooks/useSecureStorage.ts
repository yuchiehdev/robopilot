import { useState, useEffect } from 'react';

interface EncryptedData {
  encryptedData: ArrayBuffer;
  iv: Uint8Array;
}

const generateKey = async (): Promise<CryptoKey> => {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  return key;
};

const encryptData = async (key: CryptoKey, data: string): Promise<EncryptedData> => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // initialization vector for AES-GCM

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedData,
  );

  return { encryptedData, iv };
};

const decryptData = async (
  key: CryptoKey,
  encryptedData: ArrayBuffer,
  iv: Uint8Array,
): Promise<string> => {
  try {
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encryptedData,
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error(`Error during decryption: ${error}`);
    throw error;
  }
};

export const useSecureStorage = (): {
  storeData: (keyName: string, data: string) => Promise<void>;
  retrieveData: (keyName: string) => Promise<string | null>;
} => {
  const [key, setKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    const generateAndSetKey = async () => {
      const generatedKey = await generateKey();
      setKey(generatedKey);
    };

    generateAndSetKey();
  }, []);

  const storeData = async (keyName: string, data: string): Promise<void> => {
    if (window.crypto && window.crypto.subtle) {
      // Do Nothing, Varify the browser supports Web Crypto API
    } else {
      console.warn(
        "Your browser doesn't support crypto. Some features may not work correctly.",
      );
    }
    if (!key) {
      // console.error('Encryption key is not available yet.');
      return;
    }

    const { encryptedData, iv } = await encryptData(key, data);
    localStorage.setItem(
      keyName,
      JSON.stringify({
        encryptedData: Array.from(new Uint8Array(encryptedData)),
        iv: Array.from(iv),
      }),
    );
  };

  const retrieveData = async (keyName: string): Promise<string | null> => {
    if (window.crypto && window.crypto.subtle) {
      // Do Nothing, Varify the browser supports Web Crypto API
    } else {
      console.warn(
        "Your browser doesn't support crypto. Some features may not work correctly.",
      );
    }
    if (!key) {
      // console.error('Encryption key is not available yet.');
      return null;
    }

    const storedData = JSON.parse(localStorage.getItem(keyName) as string);

    if (storedData) {
      const decryptedData = await decryptData(
        key,
        new Uint8Array(storedData.encryptedData).buffer,
        new Uint8Array(storedData.iv),
      );
      return decryptedData;
    }
    console.error('Could not find the stored data.');
    return null;
  };

  return { storeData, retrieveData };
};
