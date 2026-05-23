# University Management System

## 1. Proje Açıklaması

Bu proje, üniversite yönetimi için geliştirilmiş bir full-stack uygulamadır.
Backend tarafında **ASP.NET Core Web API**, frontend tarafında **React (Vite)** kullanılmıştır.
Veritabanı olarak **SQL Server (LocalDB)** ve ORM olarak **Entity Framework Core** kullanılmıştır.

Projede aşağıdaki işlemler gerçekleştirilmektedir:

* Department (Bölüm) CRUD işlemleri
* Teacher (Öğretmen) CRUD işlemleri
* Student (Öğrenci) CRUD işlemleri
* Student - Teacher Many-to-Many ilişki yönetimi
* JWT Authentication (giriş sistemi)
* Admin / User rol bazlı yetkilendirme

---

## 2. Kullanılan Teknolojiler

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server / LocalDB
* JWT Authentication
* Swagger

### Frontend

* React
* Vite
* Axios
* React Router DOM

---

## 3. Proje Yapısı

```
ProjeKlasoru/
 ┣ UniversityAPI/           -> Backend
 ┣ university-frontend/     -> Frontend
 ┗ README.md
```

---

## 4. Gereksinimler

Projeyi çalıştırmadan önce aşağıdakilerin kurulu olması gerekir:

* .NET SDK
* Node.js
* SQL Server veya LocalDB
* Visual Studio / VS Code

---

## 5. Veritabanı Ayarları

Backend projesindeki `appsettings.json` dosyasında bağlantı cümlesi bulunmaktadır.

Örnek:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=UniversityDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

Gerekirse kendi SQL Server ayarınıza göre düzenleyebilirsiniz.

---

## 6. Backend Kurulum ve Çalıştırma

### 6.1 Backend klasörüne gir

```bash
cd UniversityAPI
```

### 6.2 Paketleri yükle

```bash
dotnet restore
```

### 6.3 Migration oluştur

```bash
dotnet ef migrations add InitialCreate
```

### 6.4 Veritabanını oluştur

```bash
dotnet ef database update
```

### 6.5 Backend’i çalıştır

```bash
dotnet run
```

Swagger arayüzü:

```
http://localhost:5260/swagger
```

---

## 7. Frontend Kurulum ve Çalıştırma

### 7.1 Frontend klasörüne gir

```bash
cd university-frontend
```

### 7.2 Paketleri yükle

```bash
npm install
```

### 7.3 Uygulamayı başlat

```bash
npm run dev
```

Frontend adresi:

```
http://localhost:5173
```

---

## 8. Giriş Bilgileri

### Admin

* Kullanıcı adı: `admin`
* Şifre: `1234`

### User

* Kullanıcı adı: `user`
* Şifre: `1234`

---

## 9. Yetkilendirme

* **Admin:** Tüm işlemleri yapabilir (ekleme, silme, güncelleme, listeleme)
* **User:** Sadece listeleme ve görüntüleme yapabilir

---

## 10. Çalıştırma Sırası

1. Backend başlatılır (`dotnet run`)
2. Frontend başlatılır (`npm run dev`)
3. Tarayıcıdan frontend açılır
4. Kullanıcı ile giriş yapılır
5. Rol bazlı işlemler gerçekleştirilir

---

## 11. API Endpoint Örnekleri

### Auth

* POST `/api/Auth/login`

### Departments

* GET `/api/Departments`
* POST `/api/Departments`
* PUT `/api/Departments/{id}`
* DELETE `/api/Departments/{id}`

### Teachers

* GET `/api/Teachers`
* POST `/api/Teachers`
* DELETE `/api/Teachers/{id}`

### Students

* GET `/api/Students`
* POST `/api/Students`
* DELETE `/api/Students/{id}`

---

## 12. Notlar

* JWT token gerektiren endpointlerde önce login yapılmalıdır.
* Swagger üzerinden API testleri yapılabilir.
* Token Swagger Authorize kısmına girilerek test yapılabilir.
* Backend tarafında rol bazlı yetkilendirme aktif olarak uygulanmıştır.

---

## 13. Hazırlayan

Mehmet Emir Aydin - 2023150006
