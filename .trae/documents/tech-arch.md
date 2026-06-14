## 1. 架构设计

```mermaid
graph TB
    subgraph "前端层"
        "UI 层 (React + Tailwind)" --> "状态层 (Zustand)"
        "状态层" --> "3D 渲染层 (@react-three/fiber)"
        "3D 渲染层" --> "物理模拟 (自定义物理引擎)"
        "3D 渲染层" --> "后处理 (@react-three/postprocessing)"
        "3D 渲染层" --> "辅助组件 (@react-three/drei)"
    end
    subgraph "数据层"
        "地形生成 (噪声算法)"
        "云层生成 (程序化)"
        "气流/星星分布"
    end
    "数据层" --> "3D 渲染层"
```

## 2. 技术描述
- **前端**：React@18 + TypeScript + Vite
- **UI 样式**：tailwindcss@3
- **状态管理**：zustand
- **3D 引擎**：three, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **无后端、无数据库**：纯前端体验，所有数据程序化生成

## 3. 路由定义
| 路由 | 用途 |
|-----|------|
| / | 主菜单页：模式选择、操作说明、开始飞行 |
| /fly | 飞行场景页：3D 沉浸式飞行体验 |

## 4. 核心模块说明

### 4.1 状态管理 (Zustand)
- `gameMode`: 'relax' | 'collect' — 飞行模式
- `gameStatus`: 'menu' | 'flying' | 'paused'
- `flightState`: { altitude, speed, inUpdraft, starsCollected }
- `actions`: { setMode, startFlight, pauseFlight, resumeFlight, collectStar, updateFlightState }

### 4.2 物理模拟模块
- 重力：恒定向下加速度 9.8 m/s²
- 升力：与空速平方成正比，俯仰角调节系数
- 阻力：与空速平方成正比
- 上升气流：进入气流柱区域时叠加向上的速度分量
- 转向：鼠标水平位移 → 偏航角速度，垂直位移 → 俯仰角速度
- 倾斜：转向时滑翔机自动侧倾

### 4.3 地形生成
- 使用 Simplex 噪声多层叠加生成高度图
- 低模 + 顶点色着色，山脉与山谷自然过渡
- 远景雾化，增强纵深感

### 4.4 体积云系统
- 使用多层透明精灵片（sprite billboards）模拟体积
- 程序化分布，随风缓慢移动和变形
- 深度排序 + 半透明混合
- 云隙阳光效果（god rays 可通过 Bloom + 遮挡模拟）

### 4.5 上升气流系统
- 在山谷区域随机生成气流柱位置
- 可视化：半透明金色圆柱体，内有粒子向上流动
- 进入范围后 HUD 指示 + 物理升力加成

### 4.6 星星收集（可选模式）
- 在合理飞行高度区间随机散布发光金色星星
- 距离阈值内自动收集，收集时有发光粒子动画
- HUD 实时显示收集数量

## 5. 文件结构
```
src/
├── components/
│   ├── ui/
│   │   ├── MainMenu.tsx          # 主菜单
│   │   ├── HUD.tsx               # 飞行 HUD
│   │   └── PausePanel.tsx        # 暂停面板
│   └── three/
│       ├── Glider.tsx            # 滑翔机模型与控制
│       ├── Terrain.tsx           # 程序化地形
│       ├── Clouds.tsx            # 体积云系统
│       ├── Updrafts.tsx          # 上升气流
│       ├── Stars.tsx             # 收集星星
│       └── Scene.tsx             # 3D 场景装配
├── hooks/
│   ├── useFlightPhysics.ts       # 飞行物理 Hook
│   └── useMouseControls.ts       # 鼠标控制 Hook
├── stores/
│   └── gameStore.ts              # Zustand 状态管理
├── utils/
│   ├── noise.ts                  # 噪声算法
│   └── constants.ts              # 物理/游戏常量
├── pages/
│   ├── Home.tsx                  # 主菜单页面
│   └── Fly.tsx                   # 飞行场景页面
├── App.tsx
├── main.tsx
└── index.css
```
