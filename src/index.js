function isObject(obj) {
	const objType = typeof obj

	return obj !== null && (objType === "object" || objType === "function")
}

function deepCopy(originValue, map = new WeakMap()) {
	// 判断递归调用传入的值是否是一个Set或Map的实例
	if (originValue instanceof Set) {
		const newSet = new Set()
		originValue.forEach(item => {
			newSet.add(deepCopy(item))
		})
		return newSet
	}
	if (originValue instanceof Map) {
		const newMap = new Map()
		originValue.forEach((value, key) => {
			newMap.set(key, deepCopy(value))
		})
		return newMap
	}

	// 判断递归调用传入的值是否是一个Symbol类型
	if (typeof originValue === "symbol") {
		return Symbol(originValue.description)
	}

	// 判断递归调用传入的值是否是一个函数类型
	if (typeof originValue === "function") {
		return originValue
	}

	// 判断递归调用传入的origiinValue是否是一个对象类型 和 第一次调用时传入的是否是一个对象类型
	if (!isObject(originValue)) {
		return originValue
	}

	// 判断是否循环引用
	if (map.has(originValue)) {
		return map.get(originValue)
	}

	// 创建一个新对象或数组
	const newObj = Array.isArray(originValue) ? [] : {}
	map.set(originValue, newObj)

	// 遍历对象
	for (const key in originValue) {
		newObj[key] = deepCopy(originValue[key], map)
	}

	// 遍历originValue上的Symbol对象
	const symbolKeys = Object.getOwnPropertySymbols(originValue)
	symbolKeys.forEach(key => {
		newObj[key] = deepCopy(originValue[key], map)
	})

	return newObj
}

// 测试
let s1 = Symbol("aaa")
let s2 = Symbol("bbb")

const obj = {
	name: "west",
	age: 18,
	friend: {
		name: "Kobe",
		address: {
			city: "广州",
		},
	},
	// 数组类型
	hobbies: ["abc", "cba", "nba"],
	// 函数类型
	foo() {
		console.log("foo is a fucntion")
	},
	// Symbol作为key和value
	[s1]: {
		name: "aaa",
	},
	s2: s2,
	// Set/Map
	set: new Set(["aaa", "bbb", "ccc"]),
	map: new Map([
		["aaa", "abc"],
		["bbb", "cba"],
	]),
}

obj.info = obj

const newObj = deepCopy(obj)
// console.log(obj === newObj)

console.log(obj)
console.log(newObj)
