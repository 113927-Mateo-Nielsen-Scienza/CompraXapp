USE [master]
GO
/****** Object:  Database [compraxappdb]    Script Date: 18/6/2025 15:24:25 ******/
CREATE DATABASE [compraxappdb]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'compraxappdb', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\compraxappdb.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'compraxappdb_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\compraxappdb_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [compraxappdb] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [compraxappdb].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [compraxappdb] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [compraxappdb] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [compraxappdb] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [compraxappdb] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [compraxappdb] SET ARITHABORT OFF 
GO
ALTER DATABASE [compraxappdb] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [compraxappdb] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [compraxappdb] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [compraxappdb] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [compraxappdb] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [compraxappdb] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [compraxappdb] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [compraxappdb] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [compraxappdb] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [compraxappdb] SET  ENABLE_BROKER 
GO
ALTER DATABASE [compraxappdb] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [compraxappdb] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [compraxappdb] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [compraxappdb] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [compraxappdb] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [compraxappdb] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [compraxappdb] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [compraxappdb] SET RECOVERY FULL 
GO
ALTER DATABASE [compraxappdb] SET  MULTI_USER 
GO
ALTER DATABASE [compraxappdb] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [compraxappdb] SET DB_CHAINING OFF 
GO
ALTER DATABASE [compraxappdb] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [compraxappdb] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [compraxappdb] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [compraxappdb] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'compraxappdb', N'ON'
GO
ALTER DATABASE [compraxappdb] SET QUERY_STORE = ON
GO
ALTER DATABASE [compraxappdb] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [compraxappdb]
GO
/****** Object:  Table [dbo].[cart_items]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart_items](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[cart_id] [bigint] NOT NULL,
	[product_id] [bigint] NOT NULL,
	[quantity] [int] NOT NULL,
	[price_per_unit] [decimal](19, 2) NOT NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[carts]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[carts](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [bigint] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[notifications]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[notifications](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [bigint] NOT NULL,
	[type] [varchar](50) NOT NULL,
	[title] [varchar](255) NOT NULL,
	[message] [text] NOT NULL,
	[read] [bit] NULL,
	[created_at] [datetime2](7) NULL,
	[related_order_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[order_items]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order_items](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[order_id] [bigint] NOT NULL,
	[product_id] [bigint] NULL,
	[product_name] [nvarchar](255) NOT NULL,
	[price] [decimal](19, 2) NOT NULL,
	[quantity] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orders]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orders](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [bigint] NOT NULL,
	[order_date] [datetime2](7) NOT NULL,
	[status] [nvarchar](50) NOT NULL,
	[total_amount] [decimal](19, 2) NULL,
	[shipping_address] [nvarchar](500) NULL,
	[shipping_status] [nvarchar](50) NULL,
	[tracking_number] [nvarchar](100) NULL,
	[shipping_date] [datetime2](7) NULL,
	[delivery_date] [datetime2](7) NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[payments]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payments](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[order_id] [bigint] NOT NULL,
	[method] [nvarchar](50) NOT NULL,
	[status] [nvarchar](50) NOT NULL,
	[amount] [decimal](19, 2) NOT NULL,
	[external_payment_id] [nvarchar](255) NULL,
	[payment_date] [datetime2](7) NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[updated_at] [datetime2](7) NULL,
	[confirmed_at] [datetime2](7) NULL,
	[mercado_pago_payment_id] [nvarchar](255) NULL,
	[confirmation_method] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[products]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[products](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[description] [nvarchar](max) NULL,
	[price] [decimal](19, 2) NOT NULL,
	[stock_quantity] [int] NOT NULL,
	[image_url] [nvarchar](500) NULL,
	[active] [bit] NOT NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
	[category] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[promotions]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[promotions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[description] [nvarchar](1000) NULL,
	[discount_percentage] [decimal](5, 2) NULL,
	[discount_amount] [decimal](19, 2) NULL,
	[start_date] [datetime2](7) NOT NULL,
	[end_date] [datetime2](7) NOT NULL,
	[active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[updated_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[roles]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_roles]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_roles](
	[user_id] [bigint] NOT NULL,
	[role_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC,
	[role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 18/6/2025 15:24:26 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[password] [nvarchar](255) NOT NULL,
	[shipping_address] [nvarchar](500) NULL,
	[active] [bit] NOT NULL,
	[created_at] [datetime2](7) NOT NULL,
	[password_reset_token] [nvarchar](255) NULL,
	[password_reset_token_expiry] [datetime2](7) NULL,
	[enabled] [bit] NOT NULL,
	[verification_code] [nvarchar](255) NULL,
	[verification_code_expiry_date] [datetime2](7) NULL,
	[username] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[carts] ON 

INSERT [dbo].[carts] ([id], [user_id], [created_at], [updated_at]) VALUES (1, 1, NULL, NULL)
INSERT [dbo].[carts] ([id], [user_id], [created_at], [updated_at]) VALUES (2, 2, NULL, NULL)
INSERT [dbo].[carts] ([id], [user_id], [created_at], [updated_at]) VALUES (3, 3, NULL, NULL)
SET IDENTITY_INSERT [dbo].[carts] OFF
GO
SET IDENTITY_INSERT [dbo].[notifications] ON 

INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (1, 3, N'ORDER_CREATED', N'Pedido creado exitosamente', N'Tu pedido #10004 por $890,00 ha sido registrado correctamente.', 1, CAST(N'2025-06-15T21:59:31.6026190' AS DateTime2), 10004)
INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (2, 3, N'ORDER_CREATED', N'Pedido creado exitosamente', N'Tu pedido #10005 por $390,00 ha sido registrado correctamente.', 1, CAST(N'2025-06-15T22:00:21.6192667' AS DateTime2), 10005)
INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (3, 3, N'ORDER_CREATED', N'Pedido creado exitosamente', N'Tu pedido #10006 por $540,00 ha sido registrado correctamente.', 1, CAST(N'2025-06-15T22:05:02.0986783' AS DateTime2), 10006)
INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (4, 3, N'ORDER_CREATED', N'Pedido creado exitosamente', N'Tu pedido #10007 por $500,00 ha sido registrado correctamente.', 1, CAST(N'2025-06-15T23:08:23.5782625' AS DateTime2), 10007)
INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (5, 3, N'ORDER_CREATED', N'Pedido creado exitosamente', N'Tu pedido #10008 por $1000,00 ha sido registrado correctamente.', 1, CAST(N'2025-06-16T01:20:13.4342742' AS DateTime2), 10008)
INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (6, 3, N'ORDER_CREATED', N'Pedido creado exitosamente', N'Tu pedido #10009 por $580,00 ha sido registrado correctamente.', 1, CAST(N'2025-06-16T04:48:06.4551414' AS DateTime2), 10009)
INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (7, 2, N'ORDER_CREATED', N'Pedido creado exitosamente', N'Tu pedido #10010 por $930,00 ha sido registrado correctamente.', 1, CAST(N'2025-06-17T20:07:31.9840416' AS DateTime2), 10010)
INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (8, 2, N'PROMOTION', N'Nueva promoción disponible', N'Promocion de verano: mistica', 0, CAST(N'2025-06-17T22:33:39.0447029' AS DateTime2), NULL)
INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (9, 3, N'PROMOTION', N'Nueva promoción disponible', N'Promocion de verano: mistica', 0, CAST(N'2025-06-17T22:33:41.6004397' AS DateTime2), NULL)
INSERT [dbo].[notifications] ([id], [user_id], [type], [title], [message], [read], [created_at], [related_order_id]) VALUES (10, 2, N'ORDER_CREATED', N'Pedido creado exitosamente', N'Tu pedido #10011 por $500,00 ha sido registrado correctamente.', 0, CAST(N'2025-06-17T22:50:21.3571574' AS DateTime2), 10011)
SET IDENTITY_INSERT [dbo].[notifications] OFF
GO
SET IDENTITY_INSERT [dbo].[order_items] ON 

INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (1, 1, 2, N'Laptop Gaming MSI Katana 15', CAST(1299.99 AS Decimal(19, 2)), 2)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (2, 2, 2, N'Laptop Gaming MSI Katana 15', CAST(1299.99 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (3, 3, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 3)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (4, 4, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (5, 4, 6, N'saladix', CAST(40.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (6, 5, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (7, 5, 6, N'saladix', CAST(40.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (8, 6, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (9, 6, 6, N'saladix', CAST(40.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10, 6, 7, N'Cheetos', CAST(350.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10004, 10004, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10005, 10004, 6, N'saladix', CAST(40.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10006, 10004, 7, N'Cheetos', CAST(350.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10007, 10005, 7, N'Cheetos', CAST(350.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10008, 10005, 6, N'saladix', CAST(40.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10009, 10006, 6, N'saladix', CAST(40.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10010, 10006, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10011, 10007, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10012, 10008, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 2)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10013, 10009, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10014, 10009, 6, N'saladix', CAST(40.00 AS Decimal(19, 2)), 2)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10015, 10010, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10016, 10010, 6, N'saladix', CAST(40.00 AS Decimal(19, 2)), 2)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10017, 10010, 7, N'Cheetos', CAST(350.00 AS Decimal(19, 2)), 1)
INSERT [dbo].[order_items] ([id], [order_id], [product_id], [product_name], [price], [quantity]) VALUES (10018, 10011, 5, N'papitas', CAST(500.00 AS Decimal(19, 2)), 1)
SET IDENTITY_INSERT [dbo].[order_items] OFF
GO
SET IDENTITY_INSERT [dbo].[orders] ON 

INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (1, 1, CAST(N'2025-06-03T22:26:34.7098491' AS DateTime2), N'CANCELLED', CAST(2599.98 AS Decimal(19, 2)), N'Calle Test 123, Ciudad Test, CP 12345', NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (2, 3, CAST(N'2025-06-03T22:57:59.4597482' AS DateTime2), N'COMPLETED', CAST(1299.99 AS Decimal(19, 2)), N'rolfestersda', NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (3, 2, CAST(N'2025-06-04T21:10:54.6132137' AS DateTime2), N'CANCELLED', CAST(1500.00 AS Decimal(19, 2)), N'lolxdxdxdxd', NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (4, 3, CAST(N'2025-06-14T12:55:47.4902594' AS DateTime2), N'PENDING', CAST(540.00 AS Decimal(19, 2)), N'luisiana 2044', N'PENDING', NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (5, 3, CAST(N'2025-06-14T16:11:18.7038762' AS DateTime2), N'PENDING', CAST(540.00 AS Decimal(19, 2)), N'Luisiana 2044', N'PENDING', NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (6, 3, CAST(N'2025-06-14T20:35:12.2821114' AS DateTime2), N'PENDING', CAST(890.00 AS Decimal(19, 2)), N'luisianaaaa', N'PENDING', NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (10004, 3, CAST(N'2025-06-15T21:59:31.5788078' AS DateTime2), N'PENDING', CAST(890.00 AS Decimal(19, 2)), N'luisiana 2044', N'PENDING', NULL, NULL, NULL, CAST(N'2025-06-15T21:59:31.5900000' AS DateTime2), NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (10005, 3, CAST(N'2025-06-15T22:00:21.6112675' AS DateTime2), N'PENDING', CAST(390.00 AS Decimal(19, 2)), N'luisiaana 2011', N'PENDING', NULL, NULL, NULL, CAST(N'2025-06-15T22:00:21.6133333' AS DateTime2), NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (10006, 3, CAST(N'2025-06-15T22:05:02.0886788' AS DateTime2), N'PENDING', CAST(540.00 AS Decimal(19, 2)), N'aaaaaaaaaaaaaaaaa', N'PENDING', NULL, NULL, NULL, CAST(N'2025-06-15T22:05:02.0900000' AS DateTime2), NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (10007, 3, CAST(N'2025-06-15T23:08:23.4665320' AS DateTime2), N'PENDING', CAST(500.00 AS Decimal(19, 2)), N'aaaaaaaaaa', N'PENDING', NULL, NULL, NULL, CAST(N'2025-06-15T23:08:23.5433333' AS DateTime2), NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (10008, 3, CAST(N'2025-06-16T01:20:13.4171766' AS DateTime2), N'PENDING', CAST(1000.00 AS Decimal(19, 2)), N'asdasdadsa', N'PENDING', NULL, NULL, NULL, CAST(N'2025-06-16T01:20:13.4233333' AS DateTime2), NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (10009, 3, CAST(N'2025-06-16T04:48:06.3838090' AS DateTime2), N'PENDING', CAST(580.00 AS Decimal(19, 2)), N'aaaaaaaaaaaaaaaaa', N'PENDING', NULL, NULL, NULL, CAST(N'2025-06-16T04:48:06.4100000' AS DateTime2), NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (10010, 2, CAST(N'2025-06-17T20:07:31.9609874' AS DateTime2), N'COMPLETED', CAST(930.00 AS Decimal(19, 2)), N'aaaaaaaaaa', N'PENDING', NULL, NULL, NULL, CAST(N'2025-06-17T20:07:31.9666667' AS DateTime2), NULL)
INSERT [dbo].[orders] ([id], [user_id], [order_date], [status], [total_amount], [shipping_address], [shipping_status], [tracking_number], [shipping_date], [delivery_date], [created_at], [updated_at]) VALUES (10011, 2, CAST(N'2025-06-17T22:50:21.3371171' AS DateTime2), N'PENDING', CAST(500.00 AS Decimal(19, 2)), N'luisian 2044', N'PENDING', NULL, NULL, NULL, CAST(N'2025-06-17T22:50:21.3466667' AS DateTime2), NULL)
SET IDENTITY_INSERT [dbo].[orders] OFF
GO
SET IDENTITY_INSERT [dbo].[payments] ON 

INSERT [dbo].[payments] ([id], [order_id], [method], [status], [amount], [external_payment_id], [payment_date], [created_at], [updated_at], [confirmed_at], [mercado_pago_payment_id], [confirmation_method]) VALUES (1, 6, N'MERCADO_PAGO', N'PENDING', CAST(890.00 AS Decimal(19, 2)), NULL, CAST(N'2025-06-14T20:35:12.3824130' AS DateTime2), CAST(N'2025-06-14T20:35:12.3933333' AS DateTime2), NULL, NULL, NULL, NULL)
INSERT [dbo].[payments] ([id], [order_id], [method], [status], [amount], [external_payment_id], [payment_date], [created_at], [updated_at], [confirmed_at], [mercado_pago_payment_id], [confirmation_method]) VALUES (2, 10004, N'MERCADO_PAGO', N'PENDING', CAST(890.00 AS Decimal(19, 2)), NULL, CAST(N'2025-06-15T21:59:34.9807832' AS DateTime2), CAST(N'2025-06-15T21:59:34.9833333' AS DateTime2), NULL, NULL, NULL, NULL)
INSERT [dbo].[payments] ([id], [order_id], [method], [status], [amount], [external_payment_id], [payment_date], [created_at], [updated_at], [confirmed_at], [mercado_pago_payment_id], [confirmation_method]) VALUES (3, 10007, N'MERCADO_PAGO', N'PENDING', CAST(500.00 AS Decimal(19, 2)), NULL, CAST(N'2025-06-15T23:08:26.6643399' AS DateTime2), CAST(N'2025-06-15T23:08:26.6666667' AS DateTime2), NULL, NULL, NULL, NULL)
INSERT [dbo].[payments] ([id], [order_id], [method], [status], [amount], [external_payment_id], [payment_date], [created_at], [updated_at], [confirmed_at], [mercado_pago_payment_id], [confirmation_method]) VALUES (4, 10008, N'MERCADO_PAGO', N'PENDING', CAST(1000.00 AS Decimal(19, 2)), NULL, CAST(N'2025-06-16T01:20:16.8647760' AS DateTime2), CAST(N'2025-06-16T01:20:16.8666667' AS DateTime2), NULL, NULL, NULL, NULL)
INSERT [dbo].[payments] ([id], [order_id], [method], [status], [amount], [external_payment_id], [payment_date], [created_at], [updated_at], [confirmed_at], [mercado_pago_payment_id], [confirmation_method]) VALUES (5, 10009, N'MERCADO_PAGO', N'PENDING', CAST(580.00 AS Decimal(19, 2)), NULL, CAST(N'2025-06-16T04:48:10.6725482' AS DateTime2), CAST(N'2025-06-16T04:48:10.6833333' AS DateTime2), NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[payments] OFF
GO
SET IDENTITY_INSERT [dbo].[products] ON 

INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (1, N'producto augusto', N'moli', CAST(99.00 AS Decimal(19, 2)), 1, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzB_ZZM-m0nRHpZ8IrxpdJVG7dzuTPGsNWTw&s', 0, NULL, NULL, NULL)
INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (2, N'Laptop Gaming MSI Katana 15', N'Laptop gaming con procesador Intel Core i7, 16GB RAM, SSD 512GB, GeForce RTX 4060, pantalla 15.6" Full HD 144Hz. Perfecta para gaming y trabajo profesional.', CAST(1299.99 AS Decimal(19, 2)), 12, N'https://example.com/images/laptop-gaming-msi.jpg', 0, NULL, NULL, NULL)
INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (3, N'Samsung Galaxy S24 Ultra 256GB', N'Smartphone premium con cámara de 200MP, pantalla Dynamic AMOLED 6.8", S Pen incluido, batería 5000mAh, resistente al agua IP68. Color Negro Titanio.', CAST(899.99 AS Decimal(19, 2)), 25, N'https://example.com/images/samsung-galaxy-s24-ultra.jpg', 0, NULL, NULL, NULL)
INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (4, N'Sony WH-1000XM5 Auriculares Inalámbricos', N'Auriculares premium con cancelación de ruido líder en la industria, sonido Hi-Res Audio, batería de 30 horas, carga rápida, micrófono con IA para llamadas cristalinas.', CAST(349.99 AS Decimal(19, 2)), 40, N'https://example.com/images/sony-wh1000xm5.jpg', 0, NULL, NULL, NULL)
INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (5, N'papitas', N'Papas/snacks', CAST(300.00 AS Decimal(19, 2)), 36, N'https://arcordiezb2c.vteximg.com.br/arquivos/ids/178970/Papas-Fritas-Clasicas-Lays-230-Gr-1-16959.jpg?v=638270409665500000', 1, NULL, NULL, NULL)
INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (6, N'saladix', N'galletas muy baratas', CAST(40.00 AS Decimal(19, 2)), 40, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFtYyEcMQlXT26R6V2mRpUhct_-sEk-3oKtA&s', 1, NULL, NULL, NULL)
INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (7, N'Cheetos', N'Muy buenos chisitos', CAST(350.00 AS Decimal(19, 2)), 71, N'https://www.casa-segal.com/wp-content/uploads/2023/01/cheetos-queso-94-g-snacks-casa-segal-mendoza-ofertas-en-mendoza-casa-segal-min.jpg', 1, NULL, NULL, NULL)
INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (8, N'doritos', N'el mejor snack de todos', CAST(400.00 AS Decimal(19, 2)), 25, N'https://laesquinadetandil.com.ar/wp-content/uploads/2024/11/dorito.png', 1, NULL, NULL, NULL)
INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (9, N'Alfajor oreo', N'alfajor muy rico', CAST(100.00 AS Decimal(19, 2)), 1, N'https://elnenearg.vtexassets.com/arquivos/ids/162342-800-auto?v=637971142754870000&width=800&height=auto&aspect=true', 0, NULL, NULL, NULL)
INSERT [dbo].[products] ([id], [name], [description], [price], [stock_quantity], [image_url], [active], [created_at], [updated_at], [category]) VALUES (10, N'Papas kento', N'Papas mas o menos ricas', CAST(350.00 AS Decimal(19, 2)), 50, N'https://masonlineprod.vtexassets.com/arquivos/ids/302994-800-auto?v=638322249827500000&width=800&height=auto&aspect=true', 0, CAST(N'2025-06-16T01:33:34.0433333' AS DateTime2), NULL, NULL)
SET IDENTITY_INSERT [dbo].[products] OFF
GO
SET IDENTITY_INSERT [dbo].[promotions] ON 

INSERT [dbo].[promotions] ([id], [title], [description], [discount_percentage], [discount_amount], [start_date], [end_date], [active], [created_at], [updated_at]) VALUES (1, N'Promocion de verano', N'mistica', CAST(5.00 AS Decimal(5, 2)), NULL, CAST(N'2025-06-18T01:32:00.0000000' AS DateTime2), CAST(N'2025-06-19T01:32:00.0000000' AS DateTime2), 1, CAST(N'2025-06-17T22:32:57.6333333' AS DateTime2), NULL)
SET IDENTITY_INSERT [dbo].[promotions] OFF
GO
SET IDENTITY_INSERT [dbo].[roles] ON 

INSERT [dbo].[roles] ([id], [name]) VALUES (2, N'ROLE_ADMIN')
INSERT [dbo].[roles] ([id], [name]) VALUES (1, N'ROLE_USER')
SET IDENTITY_INSERT [dbo].[roles] OFF
GO
INSERT [dbo].[user_roles] ([user_id], [role_id]) VALUES (1, 1)
INSERT [dbo].[user_roles] ([user_id], [role_id]) VALUES (2, 1)
INSERT [dbo].[user_roles] ([user_id], [role_id]) VALUES (2, 2)
INSERT [dbo].[user_roles] ([user_id], [role_id]) VALUES (3, 1)
INSERT [dbo].[user_roles] ([user_id], [role_id]) VALUES (4, 1)
GO
SET IDENTITY_INSERT [dbo].[users] ON 

INSERT [dbo].[users] ([id], [name], [email], [password], [shipping_address], [active], [created_at], [password_reset_token], [password_reset_token_expiry], [enabled], [verification_code], [verification_code_expiry_date], [username]) VALUES (1, N'Test Actualizado', N'test@example.com', N'password123', N'Av. Corrientes 1234', 0, CAST(N'2025-06-03T16:38:42.1233333' AS DateTime2), NULL, NULL, 1, NULL, NULL, N'test')
INSERT [dbo].[users] ([id], [name], [email], [password], [shipping_address], [active], [created_at], [password_reset_token], [password_reset_token_expiry], [enabled], [verification_code], [verification_code_expiry_date], [username]) VALUES (2, N'Admin User', N'admin@compraxapp.com', N'admin123', NULL, 1, CAST(N'2025-06-03T16:38:42.1233333' AS DateTime2), NULL, NULL, 1, NULL, NULL, N'admin')
INSERT [dbo].[users] ([id], [name], [email], [password], [shipping_address], [active], [created_at], [password_reset_token], [password_reset_token_expiry], [enabled], [verification_code], [verification_code_expiry_date], [username]) VALUES (3, N'mateo scienzar', N'mateoscns@gmail.com', N'mateo123', N'Casa 1324', 1, CAST(N'2025-06-03T16:40:53.4572619' AS DateTime2), NULL, NULL, 1, NULL, NULL, N'mateoscns')
INSERT [dbo].[users] ([id], [name], [email], [password], [shipping_address], [active], [created_at], [password_reset_token], [password_reset_token_expiry], [enabled], [verification_code], [verification_code_expiry_date], [username]) VALUES (4, N'azul jara', N'jaraazul1@gmail.com', N'azul123', NULL, 0, CAST(N'2025-06-04T02:24:19.7775649' AS DateTime2), NULL, NULL, 1, NULL, NULL, N'jaraazul1')
SET IDENTITY_INSERT [dbo].[users] OFF
GO
/****** Object:  Index [IX_cart_items_cart_id]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_cart_items_cart_id] ON [dbo].[cart_items]
(
	[cart_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ__carts__B9BE370EFB1FDECB]    Script Date: 18/6/2025 15:24:26 ******/
ALTER TABLE [dbo].[carts] ADD UNIQUE NONCLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_notifications_created_at]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_notifications_created_at] ON [dbo].[notifications]
(
	[created_at] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_notifications_read]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_notifications_read] ON [dbo].[notifications]
(
	[read] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_notifications_user_id]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_notifications_user_id] ON [dbo].[notifications]
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_order_items_order_id]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_order_items_order_id] ON [dbo].[order_items]
(
	[order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_orders_status]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_orders_status] ON [dbo].[orders]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_orders_user_id]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_orders_user_id] ON [dbo].[orders]
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_payments_order_id]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_payments_order_id] ON [dbo].[payments]
(
	[order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_payments_status]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_payments_status] ON [dbo].[payments]
(
	[status] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_products_active]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_products_active] ON [dbo].[products]
(
	[active] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_products_category]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_products_category] ON [dbo].[products]
(
	[category] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_promotions_active]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_promotions_active] ON [dbo].[promotions]
(
	[active] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__roles__72E12F1BBD121331]    Script Date: 18/6/2025 15:24:26 ******/
ALTER TABLE [dbo].[roles] ADD UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__users__AB6E6164E92B5BCB]    Script Date: 18/6/2025 15:24:26 ******/
ALTER TABLE [dbo].[users] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_users_username]    Script Date: 18/6/2025 15:24:26 ******/
ALTER TABLE [dbo].[users] ADD  CONSTRAINT [UQ_users_username] UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_users_active]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_users_active] ON [dbo].[users]
(
	[active] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_users_enabled]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_users_enabled] ON [dbo].[users]
(
	[enabled] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_users_username]    Script Date: 18/6/2025 15:24:26 ******/
CREATE NONCLUSTERED INDEX [IX_users_username] ON [dbo].[users]
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[cart_items] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[carts] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT ((0)) FOR [read]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT (getdate()) FOR [order_date]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT ('PENDING') FOR [status]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT ('PENDING') FOR [shipping_status]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[payments] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[products] ADD  DEFAULT ((0)) FOR [stock_quantity]
GO
ALTER TABLE [dbo].[products] ADD  DEFAULT ((1)) FOR [active]
GO
ALTER TABLE [dbo].[products] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[promotions] ADD  DEFAULT ((1)) FOR [active]
GO
ALTER TABLE [dbo].[promotions] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ((1)) FOR [active]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [enabled]
GO
ALTER TABLE [dbo].[cart_items]  WITH CHECK ADD FOREIGN KEY([cart_id])
REFERENCES [dbo].[carts] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[cart_items]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[products] ([id])
GO
ALTER TABLE [dbo].[carts]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[notifications]  WITH CHECK ADD FOREIGN KEY([related_order_id])
REFERENCES [dbo].[orders] ([id])
GO
ALTER TABLE [dbo].[notifications]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[order_items]  WITH CHECK ADD FOREIGN KEY([order_id])
REFERENCES [dbo].[orders] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[order_items]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[products] ([id])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[payments]  WITH CHECK ADD  CONSTRAINT [FK_payments_orders] FOREIGN KEY([order_id])
REFERENCES [dbo].[orders] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[payments] CHECK CONSTRAINT [FK_payments_orders]
GO
ALTER TABLE [dbo].[user_roles]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[roles] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[user_roles]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[cart_items]  WITH CHECK ADD CHECK  (([quantity]>(0)))
GO
ALTER TABLE [dbo].[order_items]  WITH CHECK ADD CHECK  (([quantity]>(0)))
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD CHECK  (([status]='CANCELLED' OR [status]='COMPLETED' OR [status]='PROCESSING' OR [status]='PENDING'))
GO
ALTER TABLE [dbo].[products]  WITH CHECK ADD CHECK  (([price]>(0)))
GO
USE [master]
GO
ALTER DATABASE [compraxappdb] SET  READ_WRITE 
GO
