/* eslint-disable no-case-declarations */
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import Dropdown from '../dropdown/dropdown.jsx';
import MediaQuery from 'react-responsive';
import layout from '../../lib/layout-constants';

import { changeBrushSize, changeSegSize } from '../../reducers/brush-mode';
import { changeBrushSize as changeEraserSize } from '../../reducers/eraser-mode';
import { changeRoundedCornerSize } from '../../reducers/rounded-rect-mode';
import { changeTrianglePolyCount, changeTrianglePointCount } from '../../reducers/triangle-mode';
import { changeCurrentlySelectedShape } from '../../reducers/sussy-mode';
import { changeBitBrushSize } from '../../reducers/bit-brush-size';
import { changeBitEraserSize } from '../../reducers/bit-eraser-size';
import { setShapesFilled } from '../../reducers/fill-bitmap-shapes';
import { setIsPerfectValue } from '../../reducers/isperfect';
import { setIsInvertedValue } from '../../reducers/isinverted';
import { setCornersToRound } from '../../reducers/corners-to-round';

import FontDropdown from '../../containers/font-dropdown.jsx';
import LiveInputHOC from '../forms/live-input-hoc.jsx';
import LiveBoolInputHOC from '../forms/live-bool-input-hoc.jsx';
import Label from '../forms/label.jsx';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Input from '../forms/input.jsx';
import BooleanInput from '../forms/boolean.jsx';
import InputGroup from '../input-group/input-group.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import Modes from '../../lib/modes';
import Formats, { isBitmap, isVector } from '../../lib/format';
import { hideLabel } from '../../lib/hide-label';
import styles from './mode-tools.css';

import copyIcon from './icons/copy.svg';
import cutIcon from './icons/cut.svg';
import pasteIcon from './icons/paste.svg';
import deleteIcon from './icons/delete.svg';
import roundLine from './icons/round-line.svg';
import squareLine from './icons/square-line.svg';
import miterLineJoin from './icons/miter-line-join.svg';
import roundLineJoin from './icons/round-line-join.svg';
import bevelLineJoin from './icons/bevel-line-join.svg';

import shapeMergeIcon from './icons/merge.svg';
import shapeMaskIcon from './icons/mask.svg';
import shapeSubtractIcon from './icons/subtract.svg';
import shapeFilterIcon from './icons/filter.svg';

import invertSelectedIcon from './icons/invert-selected-items.svg';

import alignLeftIcon from './icons/alignLeft.svg';
import alignRightIcon from './icons/alignRight.svg';
import alignCenterIcon from './icons/alignCenter.svg';

import italicIcon from './icons/italic.svg';
import underlineIcon from './icons/underline.svg';
import boldIcon from './icons/bold.svg';

import topLeftRoundedIcon from './icons/top-left-rounded.svg';
import topLeftSharpIcon from './icons/top-left-sharp.svg';

import bitBrushIcon from '../bit-brush-mode/brush.svg';
import bitEraserIcon from '../bit-eraser-mode/eraser.svg';
import bitLineIcon from '../bit-line-mode/line.svg';
import brushIcon from '../brush-mode/brush.svg';
import curvedPointIcon from './icons/curved-point.svg';
import eraserIcon from '../eraser-mode/eraser.svg';
import roundedRectIcon from '../rounded-rect-mode/rounded-rectangle.svg';
import triangleIcon from '../triangle-mode/triangle.svg';
import triangleSpikeRatioIcon from './icons/triangle-spike-ratio.svg';
import flipHorizontalIcon from './icons/flip-horizontal.svg';
import flipVerticalIcon from './icons/flip-vertical.svg';
import centerSelectionIcon from './icons/centerSelection.svg';
import straightPointIcon from './icons/straight-point.svg';
import bitOvalIcon from '../bit-oval-mode/oval.svg';
import bitRectIcon from '../bit-rect-mode/rectangle.svg';
import bitOvalOutlinedIcon from '../bit-oval-mode/oval-outlined.svg';
import bitRectOutlinedIcon from '../bit-rect-mode/rectangle-outlined.svg';

import { MAX_STROKE_WIDTH } from '../../reducers/stroke-width';

import selectableShapes from '../../helper/selectable-shapes.js';

const LiveInput = LiveInputHOC(Input);
const LiveBooleanInput = LiveBoolInputHOC(BooleanInput);
const ModeToolsComponent = props => {
    const messages = defineMessages({
        brushSize: {
            defaultMessage: 'Size',
            description: 'Label for the brush size input',
            id: 'paint.modeTools.brushSize'
        },
        brushSeg: {
            defaultMessage: 'Smoothing',
            description: 'Label for the brush smoothing input',
            id: 'paint.modeTools.brushSeg'
        },
        eraserSize: {
            defaultMessage: 'Eraser size',
            description: 'Label for the eraser size input',
            id: 'paint.modeTools.eraserSize'
        },
        roundedCornerSize: {
            defaultMessage: 'Rounded corner size',
            description: 'Label for the Rounded corner size input',
            id: 'paint.modeTools.roundedCornerSize'
        },
        currentSideCount: {
            defaultMessage: 'Polygon side count',
            description: 'Label for the Polygon side count input',
            id: 'paint.modeTools.currentSideCount'
        },
        spokeRatio: {
            defaultMessage: 'Star spoke ratio',
            description: 'Label for the Star spoke ratio input, controls the size of the spokes on a star',
            id: 'paint.modeTools.spikeRatio'
        },
        copy: {
            defaultMessage: 'Copy',
            description: 'Label for the copy button',
            id: 'paint.modeTools.copy'
        },
        cut: {
            defaultMessage: 'Cut',
            description: 'Label for the cut button',
            id: 'paint.modeTools.cut'
        },
        paste: {
            defaultMessage: 'Paste',
            description: 'Label for the paste button',
            id: 'paint.modeTools.paste'
        },
        delete: {
            defaultMessage: 'Delete',
            description: 'Label for the delete button',
            id: 'paint.modeTools.delete'
        },
        curved: {
            defaultMessage: 'Curved',
            description: 'Label for the button that converts selected points to curves',
            id: 'paint.modeTools.curved'
        },
        pointed: {
            defaultMessage: 'Pointed',
            description: 'Label for the button that converts selected points to sharp points',
            id: 'paint.modeTools.pointed'
        },
        thickness: {
            defaultMessage: 'Thickness',
            description: 'Label for the number input to choose the line thickness',
            id: 'paint.modeTools.thickness'
        },
        flipHorizontal: {
            defaultMessage: 'Flip Horizontal',
            description: 'Label for the button to flip the image horizontally',
            id: 'paint.modeTools.flipHorizontal'
        },
        flipVertical: {
            defaultMessage: 'Flip Vertical',
            description: 'Label for the button to flip the image vertically',
            id: 'paint.modeTools.flipVertical'
        },
        filled: {
            defaultMessage: 'Filled',
            description: 'Label for the button that sets the bitmap rectangle/oval mode to draw outlines',
            id: 'paint.modeTools.filled'
        },
        outlined: {
            defaultMessage: 'Outlined',
            description: 'Label for the button that sets the bitmap rectangle/oval mode to draw filled-in shapes',
            id: 'paint.modeTools.outlined'
        },
        perfect: {
            defaultMessage: 'Perfect Shape',
            description: 'Label for the button that makes the pc perfect circle/square feature available in mobile aswell',
            id: 'paint.modeTools.perfect'
        },
        movementCenter: {
            defaultMessage: 'Center',
            description: 'Label for the button that moves the selected objects to the center of the canvas',
            id: 'paint.modeTools.movementCenter'
        },
        rounded: {
            defaultMessage: 'Rounded',
            description: 'A Label.',
            id: 'paint.modeTools.rounded'
        },
        masktools: {
            defaultMessage: 'Booleans',
            description: 'Label for dropdown to access the masking tools',
            id: 'paint.modeTools.masktools'
        },
    });

    useEffect(() => {
        if (props.isPerfectValue !== false) {
            props.onPerfectChange(false);
        }
    }, []);

    const [icon1, setIcon1] = useState(topLeftRoundedIcon);
    const [icon2, setIcon2] = useState(topLeftRoundedIcon);
    const [icon3, setIcon3] = useState(topLeftRoundedIcon);
    const [icon4, setIcon4] = useState(topLeftRoundedIcon);

    const handleIcon1Click = () => {
        setIcon1(prev => {
            const next = prev === topLeftRoundedIcon ? topLeftSharpIcon : topLeftRoundedIcon;

            props.onCornersToRoundChange({
                "topLeft": next === topLeftRoundedIcon
            });

            return next;
        });
    };

    const handleIcon2Click = () => {
        setIcon2(prev => {
            const next = prev === topLeftRoundedIcon ? topLeftSharpIcon : topLeftRoundedIcon;

            props.onCornersToRoundChange({
                "topRight": next === topLeftRoundedIcon,
            });

            return next;
        });
    };

    const handleIcon3Click = () => {
        setIcon3(prev => {
            const next = prev === topLeftRoundedIcon ? topLeftSharpIcon : topLeftRoundedIcon;

            props.onCornersToRoundChange({
                "bottomLeft": next === topLeftRoundedIcon,
            });

            return next;
        });
    };

    const handleIcon4Click = () => {
        setIcon4(prev => {
            const next = prev === topLeftRoundedIcon ? topLeftSharpIcon : topLeftRoundedIcon;

            props.onCornersToRoundChange({
                "bottomRight": next === topLeftRoundedIcon,
            });

            return next;
        });
    };

    const [tick, setTick] = useState(0);

    const updateUI = () => {
        setTick(tick + 1);
    };

    switch (props.mode) {
        case Modes.BRUSH:
        /* falls through */
        case Modes.BIT_BRUSH:
        /* falls through */
        case Modes.BIT_LINE:
            {
                const currentIcon = isVector(props.format) ? brushIcon :
                    props.mode === Modes.BIT_LINE ? bitLineIcon : bitBrushIcon;
                const currentBrushValue = isBitmap(props.format) ? props.bitBrushSize : props.brushValue;
                const currentSegValue = props.segValue;
                const changeFunction = isBitmap(props.format) ? props.onBitBrushSliderChange : props.onBrushSliderChange;
                const changeFunctionSeg = props.onSegSliderChange;
                const currentMessage = props.mode === Modes.BIT_LINE ? messages.thickness : messages.brushSize;
                const hasAccuracyOption = props.mode === Modes.BRUSH;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <div>
                            <img
                                alt={props.intl.formatMessage(currentMessage)}
                                title={props.intl.formatMessage(currentMessage)}
                                className={styles.modeToolsIcon}
                                draggable={false}
                                src={currentIcon}
                            />
                        </div>
                        <Label text={props.intl.formatMessage(messages.brushSize)}>
                            <LiveInput
                                range
                                small
                                max={MAX_STROKE_WIDTH}
                                min="1"
                                type="number"
                                value={currentBrushValue}
                                onSubmit={changeFunction}
                            />
                        </Label>

                        {hasAccuracyOption && (
                            <Label text={props.intl.formatMessage(messages.brushSeg)}>
                                <LiveInput
                                    range
                                    small
                                    max={1000}
                                    min="0"
                                    type="number"
                                    value={currentSegValue}
                                    onSubmit={changeFunctionSeg}
                                />
                            </Label>
                        )}
                    </div>
                );
            }
        case Modes.BIT_ERASER:
        /* falls through */
        case Modes.ERASER:
            {
                const currentIcon = isVector(props.format) ? eraserIcon : bitEraserIcon;
                const currentEraserValue = isBitmap(props.format) ? props.bitEraserSize : props.eraserValue;
                const changeFunction = isBitmap(props.format) ? props.onBitEraserSliderChange : props.onEraserSliderChange;

                const currentInvertedValue = props.isInvertedValue;
                const changeFunctionInvertedChange = props.onInvertedChange;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <div>
                            <img
                                alt={props.intl.formatMessage(messages.eraserSize)}
                                className={styles.modeToolsIcon}
                                draggable={false}
                                src={currentIcon}
                            />
                        </div>
                        <LiveInput
                            range
                            small
                            max={MAX_STROKE_WIDTH}
                            min="1"
                            type="number"
                            value={currentEraserValue}
                            onSubmit={changeFunction}
                        />
                        {new URLSearchParams(location.search).has('livetests') && (<Label text={"   " + "Inverted"}>
                        <LiveBooleanInput
                            range
                            small
                            checked={!!currentInvertedValue}
                            onChange={changeFunctionInvertedChange}
                            style={{transform: "translate(-40%, 0%)"}}
                        />
                        </Label>)}
                    </div>
                );
            }
        case Modes.ROUNDED_RECT:
            {
                const currentIcon = roundedRectIcon;
                const currentCornerValue = props.roundedCornerValue;
                const changeFunction = props.onRoundedCornerSliderChange;
                const currentPerfectValue = props.isPerfectValue;
                const changeFunctionPerfectChange = props.onPerfectChange;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                            <div>
                                <img
                                    alt={props.intl.formatMessage(messages.roundedCornerSize)}
                                    className={styles.modeToolsIcon}
                                    draggable={false}
                                    src={currentIcon}
                                />
                            </div>
                            <LiveInput
                                range
                                small
                                max={1000}
                                min="0"
                                type="number"
                                value={currentCornerValue}
                                onSubmit={changeFunction}
                            />
                            <Label text={"   " + props.intl.formatMessage(messages.perfect)}>
                            <LiveBooleanInput
                                range
                                small
                                checked={!!currentPerfectValue}
                                onChange={changeFunctionPerfectChange}
                                style={{transform: "translate(-40%, 0%)"}}
                            />
                            </Label>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '1px 1px'
                                }}
                            >
                                <LabeledIconButton
                                    hideLabel
                                    small
                                    imgSrc={icon1}
                                    title={'Top Left'}
                                    onClick={handleIcon1Click}
                                />
                                <LabeledIconButton
                                    hideLabel
                                    small
                                    imgSrc={icon2}
                                    imgStyles={{
                                        transform: "rotate(90deg)"
                                    }}
                                    title={'Top Right'}
                                    onClick={handleIcon2Click}
                                />
                                <LabeledIconButton
                                    hideLabel
                                    small
                                    imgSrc={icon3}
                                    imgStyles={{
                                        transform: "rotate(270deg)"
                                    }}
                                    title={'Bottom Left'}
                                    onClick={handleIcon3Click}
                                />
                                <LabeledIconButton
                                    hideLabel
                                    small
                                    imgSrc={icon4}
                                    imgStyles={{
                                        transform: "rotate(180deg)"
                                    }}
                                    title={'Bottom Right'}
                                    onClick={handleIcon4Click}
                                />
                            </div>
                    </div>
                );
            }
        case Modes.TRIANGLE:
            {
                const currentIcon = triangleIcon;
                const currentSideValue = props.trianglePolyValue;
                const changeFunction = props.onPolyCountSliderChange;
                const currentPointValue = props.trianglePointValue;
                const changeFunctionPoint = props.onPointCountSliderChange;
                const currentPerfectValue = props.isPerfectValue;
                const changeFunctionPerfectChange = props.onPerfectChange;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                            <div>
                                <img
                                    alt={props.intl.formatMessage(messages.currentSideCount)}
                                    className={styles.modeToolsIcon}
                                    draggable={false}
                                    src={currentIcon}
                                />
                            </div>
                            <LiveInput
                                range
                                small
                                max={1000}
                                min="3"
                                type="number"
                                value={currentSideValue}
                                onSubmit={changeFunction}
                            />
                            <div>
                                <img
                                    alt={props.intl.formatMessage(messages.spokeRatio)}
                                    title={props.intl.formatMessage(messages.spokeRatio)}
                                    className={styles.modeToolsIcon}
                                    draggable={false}
                                    src={triangleSpikeRatioIcon}
                                />
                            </div>
                            <LiveInput
                                range
                                small
                                max={1000}
                                min="0" // Spike ratio is limited to 0.01, but setting that here makes the number input arrows work really ugly
                                step="0.1"
                                type="number"
                                value={currentPointValue}
                                onSubmit={changeFunctionPoint}
                            />
                            <Label text={"   " + props.intl.formatMessage(messages.perfect)}>
                            <LiveBooleanInput
                                range
                                small
                                checked={!!currentPerfectValue}
                                onChange={changeFunctionPerfectChange}
                                style={{transform: "translate(-40%, 0%)"}}
                            />
                            </Label>
                    </div>
                );
            }
        case Modes.SUSSY:
            {
                const currentlySelectedShape = props.currentlySelectedShape;
                const changeFunction = props.onCurrentlySelectedShapeChange;
                const selectedShapeObject = selectableShapes
                    .filter(shape => shape.id === currentlySelectedShape)[0];
                const generateShapeSVG = shapeObject => {
                    const strokeColor = '#575e75';
                    const icon = shapeObject.icon;
                    // extract viewbox
                    const viewBoxStart = icon.substring(icon.indexOf('viewBox="') + 9);
                    const viewBoxString = viewBoxStart
                        .substring(0, viewBoxStart.indexOf('"'));
                    // extract fill color
                    const fillColorStart = icon.substring(icon.indexOf('fill="') + 6);
                    const fillColorString = fillColorStart
                        .substring(0, fillColorStart.indexOf('"'));
                    // extract stroke width
                    const strokeWidthStart = icon.substring(icon.indexOf('stroke-width="') + 14);
                    const strokeWidthString = strokeWidthStart
                        .substring(0, strokeWidthStart.indexOf('"'));
                    // extract viewbox to array
                    const viewBox = viewBoxString
                        .replace(/ /gmi, ',')
                        .split(',')
                        .map(value => value.trim())
                        .map(num => Number(num));
                    const newViewBox = [
                        viewBox[0] - 1.5,
                        viewBox[1] - 1.5,
                        viewBox[2] + (1.5 * 2),
                        viewBox[3] + (1.5 * 2)
                    ].join(',');
                    const newIcon = icon
                        .replace(`viewBox="${viewBoxString}"`, `viewBox="${newViewBox}"`)
                        .replace('stroke="none"', `stroke="${strokeColor}"`)
                        .replace(`fill="${fillColorString}"`, 'fill="none"')
                        .replace(`stroke-width="${strokeWidthString}"`, `stroke-width="${shapeObject.strokeWidth}"`);
                    return `${newIcon}`;
                };
                const selectableShapesList = (
                    <InputGroup
                        className={classNames(
                            styles.modDashedBorder,
                            styles.flexCenterer,
                            styles.dropdownMaxItemList
                        )}
                    >
                        {selectableShapes.map(shape => (<LabeledIconButton
                            className={classNames(styles.dropItemShapeTool)}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={`data:image/svg+xml,${encodeURIComponent(generateShapeSVG(shape))}`}
                            title={shape.name}
                            onClick={() => changeFunction(shape.id)}
                        />))}
                    </InputGroup>
                );
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <Dropdown
                            className={styles.modUnselect}
                            enterExitTransitionDurationMs={20}
                            popoverContent={
                                <InputGroup
                                    className={styles.modContextMenu}
                                    rtl={props.rtl}
                                >
                                    {selectableShapesList}
                                </InputGroup>
                            }
                            tipSize={.01}
                        >
                            <img
                                src={`data:image/svg+xml,${encodeURIComponent(generateShapeSVG(selectedShapeObject))}`}
                                alt={selectedShapeObject.name}
                                title={selectedShapeObject.name}
                                height={16}
                            />
                        </Dropdown>
                    </div>
                );
            }
        case Modes.RESHAPE:
            const lineJoinReshape = (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        disabled={props.hasSelectedMiterLineJoin}
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={miterLineJoin}
                        title={'Spiked'}
                        onClick={props.onMiterLineJoin}
                    />
                    <LabeledIconButton
                        disabled={props.hasSelectedRoundLineJoin}
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={roundLineJoin}
                        title={props.intl.formatMessage(messages.rounded)}
                        onClick={props.onRoundLineJoin}
                    />
                    <LabeledIconButton
                        disabled={props.hasSelectedBevelLineJoin}
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={bevelLineJoin}
                        title={'Beveled'}
                        onClick={props.onBevelLineJoin}
                    />
                </InputGroup>
            );
            const deleteSelectedNodes = (
                <InputGroup className={classNames(styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={deleteIcon}
                        title={props.intl.formatMessage(messages.delete)}
                        onClick={props.onDelete}
                    />
                </InputGroup>
            );
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            disabled={!props.hasSelectedUncurvedPoints}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={curvedPointIcon}
                            title={props.intl.formatMessage(messages.curved)}
                            onClick={props.onCurvePoints}
                        />
                        <LabeledIconButton
                            disabled={!props.hasSelectedUnpointedPoints}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={straightPointIcon}
                            title={props.intl.formatMessage(messages.pointed)}
                            onClick={props.onPointPoints}
                        />
                    </InputGroup>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            disabled={props.hasSelectedRoundEnds}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={roundLine}
                            title={props.intl.formatMessage(messages.rounded)}
                            onClick={props.onRoundEnds}
                        />
                        <LabeledIconButton
                            disabled={props.hasSelectedSquareEnds}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={squareLine}
                            title={'Squared'}
                            onClick={props.onSquareEnds}
                        />
                    </InputGroup>
                    <MediaQuery minWidth={layout.fullSizeEditorMinWidthExtraToolsCollapsed}>
                        {lineJoinReshape}
                        {deleteSelectedNodes}
                    </MediaQuery>
                    <MediaQuery maxWidth={layout.fullSizeEditorMinWidthExtraToolsCollapsed - 1}>
                        <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                            <Dropdown
                                className={styles.modUnselect}
                                enterExitTransitionDurationMs={20}
                                popoverContent={
                                    <InputGroup
                                        className={styles.modContextMenu}
                                        rtl={props.rtl}
                                    >
                                        {lineJoinReshape}
                                        {deleteSelectedNodes}
                                    </InputGroup>
                                }
                                tipSize={.01}
                            >
                                More
                            </Dropdown>
                        </InputGroup>
                    </MediaQuery>
                </div>
            );
        case Modes.BIT_SELECT:
        /* falls through */
        case Modes.SELECT:
            const selectingMethods = (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={invertSelectedIcon}
                        title={'Invert Selection'}
                        onClick={props.onInvertSelected}
                    />
                </InputGroup>
            );
            const reshapingMethods = (
                <InputGroup>
                        <Dropdown
                            className={styles.modUnselect}
                            enterExitTransitionDurationMs={20}
                            popoverContent={
                                <InputGroup
                                    className={styles.modContextMenu}
                                >
                                    <LabeledIconButton
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={shapeMaskIcon}
                                        title={'Mask'}
                                        onClick={props.onMaskShape}
                                    />
                                    <LabeledIconButton
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={shapeFilterIcon}
                                        title={'Filter'}
                                        onClick={props.onExcludeShape}
                                    />
                                    <LabeledIconButton
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={shapeSubtractIcon}
                                        title={'Subtract'}
                                        onClick={props.onSubtractShape}
                                    />
                                    <LabeledIconButton
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={shapeMergeIcon}
                                        title={'Merge'}
                                        onClick={props.onMergeShape}
                                    />
                                </InputGroup>
                            }
                            tipSize={.01}
                        >
                            {props.intl.formatMessage(messages.masktools)}
                        </Dropdown>
                </InputGroup>
            );
            const flipOptions = (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={props.intl.locale !== 'en'}
                        imgSrc={flipHorizontalIcon}
                        title={props.intl.formatMessage(messages.flipHorizontal)}
                        onClick={props.onFlipHorizontal}
                    />
                    <LabeledIconButton
                        hideLabel={props.intl.locale !== 'en'}
                        imgSrc={flipVerticalIcon}
                        title={props.intl.formatMessage(messages.flipVertical)}
                        onClick={props.onFlipVertical}
                    />
                </InputGroup>
            );
            const movementOptions = (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={props.intl.locale !== 'en'}
                        imgSrc={centerSelectionIcon}
                        title={props.intl.formatMessage(messages.movementCenter)}
                        onClick={props.onCenterSelection}
                    />
                </InputGroup>
            );
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={copyIcon}
                            title={props.intl.formatMessage(messages.copy)}
                            onClick={props.onCopyToClipboard}
                        />
                        <LabeledIconButton
                            disabled={!(props.clipboardItems.length > 0)}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={pasteIcon}
                            title={props.intl.formatMessage(messages.paste)}
                            onClick={props.onPasteFromClipboard}
                        />
                        <LabeledIconButton
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={cutIcon}
                            title={props.intl.formatMessage(messages.cut)}
                            onClick={props.onCutToClipboard}
                        />
                    </InputGroup>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={deleteIcon}
                            title={props.intl.formatMessage(messages.delete)}
                            onClick={props.onDelete}
                        />
                    </InputGroup>
                    <MediaQuery minWidth={layout.fullSizeEditorMinWidthExtraToolsCollapsed}>
                        {/* Flip Options */}
                        {flipOptions}
                        {/* Movement Options */}
                        {movementOptions}
                        {/* Reshaping Methods */}
                        {(props.mode === Modes.SELECT) ? (
                            <MediaQuery minWidth={layout.fullSizeEditorMinWidthExtraTools}>
                                {reshapingMethods}
                                {selectingMethods}
                            </MediaQuery>
                        ) : null}
                        {(props.mode === Modes.SELECT) ? (
                            <MediaQuery maxWidth={layout.fullSizeEditorMinWidthExtraTools - 1}>
                                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                                    <Dropdown
                                        className={styles.modUnselect}
                                        enterExitTransitionDurationMs={20}
                                        popoverContent={
                                            <InputGroup
                                                className={styles.modContextMenu}
                                                rtl={props.rtl}
                                            >
                                                {reshapingMethods}
                                                {selectingMethods}
                                            </InputGroup>
                                        }
                                        tipSize={.01}
                                    >
                                        More
                                    </Dropdown>
                                </InputGroup>
                            </MediaQuery>
                        ) : null}
                    </MediaQuery>
                    <MediaQuery maxWidth={layout.fullSizeEditorMinWidthExtraToolsCollapsed - 1}>
                        <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                            <Dropdown
                                className={styles.modUnselect}
                                enterExitTransitionDurationMs={20}
                                popoverContent={
                                    <InputGroup
                                        className={styles.modContextMenu}
                                        rtl={props.rtl}
                                    >
                                        {flipOptions}
                                        {movementOptions}
                                        {reshapingMethods}
                                        {selectingMethods}
                                    </InputGroup>
                                }
                                tipSize={.01}
                            >
                                More
                            </Dropdown>
                        </InputGroup>
                    </MediaQuery>
                </div>
            );
        case Modes.BIT_TEXT:
        /* falls through */
        case Modes.TEXT:
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <InputGroup className={classNames(styles.modDashedBorder)}>
                        <FontDropdown
                            onUpdateImage={props.onUpdateImage}
                            onManageFonts={props.onManageFonts}
                        />
                    </InputGroup>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            hideLabel
                            imgSrc={alignLeftIcon}
                            title={'Left Align'}
                            onClick={() => {props.onTextAlignLeft(); updateUI()}}
                            highlighted={props.textAlignmentProp === "left"}
                        />
                        <LabeledIconButton
                            hideLabel
                            imgSrc={alignCenterIcon}
                            title={'Center Align'}
                            onClick={() => {props.onTextAlignCenter(); updateUI()}}
                            highlighted={props.textAlignmentProp === "center"}
                        />
                        <LabeledIconButton
                            hideLabel
                            imgSrc={alignRightIcon}
                            title={'Right Align'}
                            onClick={() => {props.onTextAlignRight(); updateUI()}}
                            highlighted={props.textAlignmentProp === "right"}
                        />
                    </InputGroup>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            imgSrc={italicIcon}
                            title={'Italic'}
                            onClick={() => {props.onTextItalic(); updateUI()}}
                            highlighted={props.isTextItalic}
                        />
                        {/*<LabeledIconButton
                            imgSrc={underlineIcon}
                            title={'Underline'}
                        />*/}
                        <LabeledIconButton
                            imgSrc={boldIcon}
                            title={'Bold'}
                            onClick={() => {props.onTextBold(); updateUI()}}
                            highlighted={props.isTextBold}
                        />
                    </InputGroup>
                </div>
            );
        case Modes.BIT_RECT:
        /* falls through */
        case Modes.BIT_OVAL:
            {
                const fillIcon = props.mode === Modes.BIT_RECT ? bitRectIcon : bitOvalIcon;
                const outlineIcon = props.mode === Modes.BIT_RECT ? bitRectOutlinedIcon : bitOvalOutlinedIcon;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <InputGroup>
                            <LabeledIconButton
                                highlighted={props.fillBitmapShapes}
                                imgSrc={fillIcon}
                                title={props.intl.formatMessage(messages.filled)}
                                onClick={props.onFillShapes}
                            />
                        </InputGroup>
                        <InputGroup>
                            <LabeledIconButton
                                highlighted={!props.fillBitmapShapes}
                                imgSrc={outlineIcon}
                                title={props.intl.formatMessage(messages.outlined)}
                                onClick={props.onOutlineShapes}
                            />
                        </InputGroup>
                        {props.fillBitmapShapes ? null : (
                            <InputGroup>
                                <Label text={props.intl.formatMessage(messages.thickness)}>
                                    <LiveInput
                                        range
                                        small
                                        max={MAX_STROKE_WIDTH}
                                        min="1"
                                        type="number"
                                        value={props.bitBrushSize}
                                        onSubmit={props.onBitBrushSliderChange}
                                    />
                                </Label>
                            </InputGroup>)
                        }
                    </div>
                );
            }
        case Modes.LINE:
            /* falls through */
        case Modes.RECT:
        /* falls through */
        case Modes.OVAL: 
            {
                const currentPerfectValue = props.isPerfectValue;
                const changeFunctionPerfectChange = props.onPerfectChange;
                return (
                    <div>
                        <Label text={props.intl.formatMessage(messages.perfect)}>
                        <LiveBooleanInput
                            range
                            small
                            checked={!!currentPerfectValue}
                            onChange={changeFunctionPerfectChange}
                            style={{transform: "translate(-40%, 0%)"}}
                        />
                        </Label>
                    </div>
                )
            }
        case Modes.ARROW:
            {
                const currentPerfectValue = props.isPerfectValue;
                const changeFunctionPerfectChange = props.onPerfectChange;
                return (
                    <div>
                        <Label text={props.intl.formatMessage(messages.perfect)}>
                        <LiveBooleanInput
                            range
                            small
                            checked={!!currentPerfectValue}
                            onChange={changeFunctionPerfectChange}
                            style={{transform: "translate(-40%, 0%)"}}
                        />
                        </Label>
                    </div>
                )
            }
        case Modes.PERSPECTIVE:
            {
                return (
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={invertSelectedIcon}
                            title={'Invert Selection'}
                            onClick={() => {props.onInvertSelected(true)}}
                        />
                    </InputGroup>
                )
            }
        default:
            // Leave empty for now, if mode not supported
            return (
                <div className={classNames(props.className, styles.modeTools)} />
            );
    }
};

ModeToolsComponent.propTypes = {
    bitBrushSize: PropTypes.number,
    bitEraserSize: PropTypes.number,
    brushValue: PropTypes.number,
    segValue: PropTypes.number,
    className: PropTypes.string,
    isPerfectValue: PropTypes.bool,
    isInvertedValue: PropTypes.bool,
    clipboardItems: PropTypes.arrayOf(PropTypes.array),
    eraserValue: PropTypes.number,
    roundedCornerValue: PropTypes.number,
    trianglePolyValue: PropTypes.number,
    trianglePointValue: PropTypes.number,
    currentlySelectedShape: PropTypes.string,
    fillBitmapShapes: PropTypes.bool,
    format: PropTypes.oneOf(Object.keys(Formats)),
    hasSelectedUncurvedPoints: PropTypes.bool,
    hasSelectedUnpointedPoints: PropTypes.bool,
    intl: intlShape.isRequired,
    mode: PropTypes.string.isRequired,
    onBitBrushSliderChange: PropTypes.func.isRequired,
    onBitEraserSliderChange: PropTypes.func.isRequired,
    onBrushSliderChange: PropTypes.func.isRequired,
    onCopyToClipboard: PropTypes.func.isRequired,
    onCutToClipboard: PropTypes.func.isRequired,
    onCurvePoints: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEraserSliderChange: PropTypes.func,
    onPerfectChange: PropTypes.func,
    onInvertedChange: PropTypes.func,
    onCornersToRoundChange: PropTypes.func,
    onFillShapes: PropTypes.func.isRequired,
    onFlipHorizontal: PropTypes.func.isRequired,
    onFlipVertical: PropTypes.func.isRequired,
    onCenterSelection: PropTypes.func.isRequired,
    onManageFonts: PropTypes.func,
    onOutlineShapes: PropTypes.func.isRequired,
    onPasteFromClipboard: PropTypes.func.isRequired,
    onPointPoints: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,

    onInvertSelected: PropTypes.func.isRequired,

    onTextAlignLeft: PropTypes.func.isRequired,
    onTextAlignRight: PropTypes.func.isRequired,
    onTextAlignCenter: PropTypes.func.isRequired,
    textAlignmentProp: PropTypes.string.isRequired,

    onTextItalic: PropTypes.func.isRequired,
    onTextUnderline: PropTypes.func.isRequired,
    onTextBold: PropTypes.func.isRequired,

    isTextItalic: PropTypes.bool.isRequired,
    isTextUnderline: PropTypes.bool.isRequired,
    isTextBold: PropTypes.bool.isRequired,

    onMergeShape: PropTypes.func.isRequired,
    onMaskShape: PropTypes.func.isRequired,
    onSubtractShape: PropTypes.func.isRequired,
    onExcludeShape: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    mode: state.scratchPaint.mode,
    format: state.scratchPaint.format,
    fillBitmapShapes: state.scratchPaint.fillBitmapShapes,
    bitBrushSize: state.scratchPaint.bitBrushSize,
    bitEraserSize: state.scratchPaint.bitEraserSize,
    brushValue: state.scratchPaint.brushMode.brushSize,
    segValue: state.scratchPaint.brushMode.segSize,
    clipboardItems: state.scratchPaint.clipboard.items,
    eraserValue: state.scratchPaint.eraserMode.brushSize,
    isPerfectValue: state.scratchPaint.isPerfectValue,
    isInvertedValue: state.scratchPaint.isInvertedValue,
    roundedCornerValue: state.scratchPaint.roundedRectMode.roundedCornerSize,
    trianglePolyValue: state.scratchPaint.triangleMode.trianglePolyCount,
    trianglePointValue: state.scratchPaint.triangleMode.trianglePointCount,
    currentlySelectedShape: state.scratchPaint.sussyMode.currentlySelectedShape
});
const mapDispatchToProps = dispatch => ({
    onBrushSliderChange: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    onSegSliderChange: brushSize => {
        dispatch(changeSegSize(brushSize));
    },
    onRoundedCornerSliderChange: roundedCornerSize => {
        dispatch(changeRoundedCornerSize(roundedCornerSize));
    },
    onPolyCountSliderChange: polyCount => {
        dispatch(changeTrianglePolyCount(polyCount));
    },
    onPointCountSliderChange: polyCount => {
        dispatch(changeTrianglePointCount(polyCount));
    },
    onCurrentlySelectedShapeChange: shape => {
        dispatch(changeCurrentlySelectedShape(shape));
    },
    onBitBrushSliderChange: bitBrushSize => {
        dispatch(changeBitBrushSize(bitBrushSize));
    },
    onBitEraserSliderChange: eraserSize => {
        dispatch(changeBitEraserSize(eraserSize));
    },
    onEraserSliderChange: eraserSize => {
        dispatch(changeEraserSize(eraserSize));
    },
    onPerfectChange: isPerfectValue => {
        dispatch(setIsPerfectValue(isPerfectValue));
    },
    onInvertedChange: isInvertedValue => {
        dispatch(setIsInvertedValue(isInvertedValue));
    },
    onCornersToRoundChange: cornersToRound => {
        dispatch(setCornersToRound(cornersToRound));
    },
    onFillShapes: () => {
        dispatch(setShapesFilled(true));
    },
    onOutlineShapes: () => {
        dispatch(setShapesFilled(false));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ModeToolsComponent));
