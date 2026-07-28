import React, { useRef } from 'react';
import { 
  Text, 
  TouchableOpacity, 
  Animated, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle, 
  StyleProp,
  View
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  className?: string;
  textClassName?: string;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  className = '',
  textClassName = '',
}: CustomButtonProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  let btnClass = 'bg-[#E8701A] shadow-md shadow-[#E8701A]/30'; // primary
  let txtClass = 'text-white';
  let loaderColor = '#ffffff';

  if (variant === 'secondary') {
    btnClass = 'bg-transparent border-[1.5px] border-[#E8701A]';
    txtClass = 'text-[#E8701A]';
    loaderColor = '#E8701A';
  } else if (variant === 'danger') {
    btnClass = 'bg-red-600 shadow-md shadow-red-600/30';
    txtClass = 'text-white';
  } else if (variant === 'glass') {
    btnClass = 'bg-slate-50 border border-slate-300 dark:bg-slate-800 dark:border-slate-700';
    txtClass = 'text-slate-900 dark:text-white';
    loaderColor = '#E8701A';
  }

  const disabledClass = (disabled || loading) ? 'opacity-50' : '';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]} className="w-full">
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
        className={`h-14 rounded-xl flex-row justify-center items-center px-5 my-1.5 w-full ${btnClass} ${disabledClass} ${className}`}
        style={style}
      >
        {loading ? (
          <ActivityIndicator color={loaderColor} />
        ) : (
          <View className="flex-row items-center justify-center">
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={`text-base font-semibold tracking-wide ${txtClass} ${textClassName}`} style={textStyle}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
