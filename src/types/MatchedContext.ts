import {
	MessageSubType,
	MountMap,
	UpdateType
} from "telegraf/typings/telegram-types";
import { Context, NarrowedContext } from "telegraf";

export type MatchedContext<
	C extends Context,
	T extends UpdateType | MessageSubType
> = NarrowedContext<C, MountMap[T]>;
