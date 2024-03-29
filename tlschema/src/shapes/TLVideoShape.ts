import { defineMigrations } from '@tldraw/store'
import { T } from '@tldraw/validate'
import { assetIdValidator } from '../assets/TLBaseAsset'
import { ShapePropsType, TLBaseShape } from './TLBaseShape'

/** @public */
export const videoShapeProps = {
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
	time: T.number,
	playing: T.boolean,
	url: T.linkUrl,
	assetId: assetIdValidator.nullable(),
}

/** @public */
export type TLVideoShapeProps = ShapePropsType<typeof videoShapeProps>

/** @public */
export type TLVideoShape = TLBaseShape<'video', TLVideoShapeProps>

const Versions = {
	AddUrlProp: 1,
	MakeUrlsValid: 2,
} as const

/** @internal */
export const videoShapeMigrations = defineMigrations({
	currentVersion: Versions.MakeUrlsValid,
	migrators: {
		[Versions.AddUrlProp]: {
			up: (shape) => {
				return { ...shape, props: { ...shape.props, url: '' } }
			},
			down: (shape) => {
				const { url: _, ...props } = shape.props
				return { ...shape, props }
			},
		},
		[Versions.MakeUrlsValid]: {
			up: (shape) => {
				const url = shape.props.url
				if (url !== '' && !T.linkUrl.isValid(shape.props.url)) {
					return { ...shape, props: { ...shape.props, url: '' } }
				}
				return shape
			},
			down: (shape) => shape,
		},
	},
})
