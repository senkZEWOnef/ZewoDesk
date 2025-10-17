# ZewoDesk Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        ZewoDesk Database Schema                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐                    ┌─────────────────────────────────────────────────┐
│       Client        │                    │                   Project                       │
├─────────────────────┤                    ├─────────────────────────────────────────────────┤
│ 🔑 id: String (PK)  │                    │ 🔑 id: String (PK)                             │
│ 📝 name: String     │                    │ 🔗 slug: String (UNIQUE)                       │
│ 📧 email: String?   │◄──────────────────►│ 📝 name: String                                │
│    (UNIQUE)         │                    │ 📄 description: String?                        │
│ 📅 createdAt: auto  │                    │ 🌐 liveUrl: String?                            │
└─────────────────────┘                    │ 📁 repoFullName: String?                       │
                                           │ ☁️ deployProvider: String?                      │
                                           │ 🆔 deployExternalId: String?                   │
                                           │ 👁️ visibility: String (default: "private")     │
┌─────────────────────┐                    │ 📅 createdAt: DateTime (auto)                  │
│ ExternalConnection  │                    │ 🔄 updatedAt: DateTime                         │
├─────────────────────┤                    │ 🖼️ previewImage: String?                       │
│ 🔑 id: String (PK)  │                    │ 📊 completionPct: Int? (default: 0)            │
│ 🔗 provider: String │                    └─────────────────────────────────────────────────┘
│ 🏷️ accountLabel: ?  │                                           │
│ 🔧 oauthMeta: Json? │                                           │
│ 📅 createdAt: auto  │                                           │
└─────────────────────┘                                           │
                                                                  │
                                                                  │
┌─────────────────────┐    ┌──────────────────────────────────────┼─────────────────────────────────────┐
│    ProjectSignup    │    │                                      │                                     │
├─────────────────────┤    │                                      ▼                                     │
│ 🔑 id: BigInt (PK)  │    │                    ┌─────────────────────────────────────────────────┐    │
│ 🔗 projectId: String├────┼───────────────────►│                ProjectDocs                      │    │
│    (FK to Project)  │    │                    ├─────────────────────────────────────────────────┤    │
│ 🔗 clientId: String?├────┼──────────────────► │ 🔑 projectId: String (PK, FK to Project)       │    │
│    (FK to Client)   │    │                    │ 📖 readmeMd: String?                           │    │
│ 📧 email: String?   │    │                    │ 📝 notesMd: String (default: "")               │    │
│ 🔧 meta: Json?      │    │                    │ 💡 brainstormingMd: String (default: "")       │    │
│ 📅 signedUpAt: auto │    │                    │ 🔄 updatedAt: DateTime                         │    │
└─────────────────────┘    │                    │ 🗃️ dbDiagramData: String?                      │    │
                           │                    └─────────────────────────────────────────────────┘    │
                           │                                                                             │
                           │                    ┌─────────────────────────────────────────────────┐    │
                           │                    │               ProjectStatus                       │    │
                           │                    ├─────────────────────────────────────────────────┤    │
                           │                    │ 🔑 projectId: String (PK, FK to Project)       │    │
                           │                    │ 🔗 lastCommitSha: String?                       │    │
                           │                    │ 📅 lastCommitAt: DateTime?                      │    │
                           │                    │ 🚀 lastDeployId: String?                        │    │
                           │                    │ 📊 lastDeployState: String?                     │    │
                           │                    │ 📅 lastDeployAt: DateTime?                      │    │
                           │                    │ 📈 uptimePct: Decimal(5,2)?                     │    │
                           │                    │ 🔄 updatedAt: DateTime                         │    │
                           │                    └─────────────────────────────────────────────────┘    │
                           │                                                                             │
┌─────────────────────┐    │                                                                             │
│      Expense        │    │                                                                             │
├─────────────────────┤    │                                                                             │
│ 🔑 id: BigInt (PK)  │    │                                                                             │
│ 🔗 projectId: String├────┼─────────────────────────────────────────────────────────────────────────────┤
│    (FK to Project)  │    │                                                                             │
│ 📝 description: Str │    │                                                                             │
│ 💰 amountCents: Int │    │                                                                             │
│ 🏷️ category: String?│    │                                                                             │
│ 📅 incurredAt: auto │    │                                                                             │
│ 📅 createdAt: auto  │    │                                                                             │
└─────────────────────┘    │                                                                             │
                           │                                                                             │
┌─────────────────────┐    │                                                                             │
│   IntegrationEvent  │    │                                                                             │
├─────────────────────┤    │                                                                             │
│ 🔑 id: BigInt (PK)  │    │                                                                             │
│ 🔗 projectId: String├────┼─────────────────────────────────────────────────────────────────────────────┤
│    (FK to Project)  │    │                                                                             │
│ 🔗 source: String   │    │                                                                             │
│ 🏷️ type: String     │    │                                                                             │
│ 🔧 payload: Json    │    │                                                                             │
│ 📅 occurredAt: auto │    │                                                                             │
│ 📅 indexedAt: auto  │    │                                                                             │
│ 📊 INDEX: projectId,│    │                                                                             │
│    occurredAt DESC  │    │                                                                             │
└─────────────────────┘    │                                                                             │
                           │                                                                             │
┌─────────────────────┐    │                                                                             │
│      Invoice        │    │                                                                             │
├─────────────────────┤    │                                                                             │
│ 🔑 id: String (PK)  │    │                                                                             │
│ 🔗 projectId: String├────┘                                                                             │
│    (FK to Project)  │                                                                                  │
│ 📝 title: String?   │                                                                                  │
│ 💰 amountCents: Int │                                                                                  │
│ 📊 status: String   │                                                                                  │
│    (default: draft) │                                                                                  │
│ 💳 stripeInvoiceId: │                                                                                  │
│    String?          │                                                                                  │
│ 📅 issuedAt: Date?  │                                                                                  │
│ 💰 paidAt: Date?    │                                                                                  │
└─────────────────────┘                                                                                  │
```

## Relationships Overview

### Central Hub: Project Table
- **Primary Key**: `id` (String)
- **Unique Constraint**: `slug`
- **Core project information**: name, description, URLs, completion percentage

### One-to-One Relationships
- **Project ↔ ProjectDocs**: Each project has exactly one docs record
- **Project ↔ ProjectStatus**: Each project has exactly one status record

### One-to-Many Relationships
- **Project → Expense**: Projects can have multiple expenses
- **Project → IntegrationEvent**: Projects can have multiple integration events
- **Project → Invoice**: Projects can have multiple invoices  
- **Project → ProjectSignup**: Projects can have multiple signups
- **Client → ProjectSignup**: Clients can sign up for multiple projects

### Foreign Key Constraints
All child tables use **CASCADE DELETE** on the project relationship:
- When a Project is deleted, all related records are automatically deleted
- Client deletions do not cascade (ProjectSignup.clientId can be NULL)

### Key Features
- **Audit Trail**: All events tracked with timestamps
- **Flexible JSON**: payload and meta fields for extensible data
- **Financial Tracking**: Expenses and invoices in cents for precision
- **Integration Ready**: GitHub integration via repoFullName
- **Documentation**: Built-in notes, brainstorming, and diagram storage
- **Performance**: Indexed on common query patterns

### Data Types
- **BigInt**: Auto-incrementing IDs for high-volume tables
- **String**: Manual IDs for primary entities
- **Json**: Flexible metadata storage
- **Decimal(5,2)**: Precise percentage calculations
- **DateTime**: Automatic and manual timestamps