export interface User {
  id?: number;
  email?: string;
  // otros campos del usuario
  roles?: string[]; // O como sea que el backend envíe los roles ahora
  authorities?: Array<{ authority: string }>; // Si Spring Security envía así los roles
}

export interface AuthResponse {
  id?: number;
  email?: string;
  username?: string; 
  roles?: string[];
  message?: string;
  authorities?: Array<{ authority: string }>;
}